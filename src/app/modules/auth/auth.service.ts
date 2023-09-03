/* eslint-disable no-console */
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { User } from '../users/user.model';
import {
  IChangePassword,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interface';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import bcrypt from 'bcrypt';

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { id, password } = payload;

  const user = new User();
  const isUserExist = await user.isUserExist(id);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (isUserExist.password && !user.isPasswordMatched(password, isUserExist?.password)) {
    throw new ApiError(httpStatus.UNAUTHORIZED, ' Password is incorrect');
  }

  // create access token , refresh token
  const { id: userID, role, needsPasswordChange } = isUserExist;

  const accessToken = jwtHelpers.createToken(
    { userID, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );
  const refreshToken = jwtHelpers.createToken(
    { userID, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange,
  };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifiedToken(token, config.jwt.refresh_secret as Secret);
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid refresh token');
  }
  // checking deleted user refresh  token

  const { userID } = verifiedToken;

  const user = new User();
  const isUserExist = await user.isUserExist(userID);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // generate new user refresh token
  const newAccesstoken = jwtHelpers.createToken(
    {
      id: isUserExist.id,
      role: isUserExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );
  return {
    accessToken: newAccesstoken,
  };
};

const changePassword = async (user: JwtPayload | null, payload: IChangePassword): Promise<void> => {
  const { oldPassword, newPassword } = payload;

  const userData = new User();
  const isUserExist = await userData.isUserExist(user?.id);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (isUserExist.password && !userData.isPasswordMatched(oldPassword, isUserExist?.password)) {
    throw new ApiError(httpStatus.UNAUTHORIZED, ' Old password is incorrect');
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, Number(config.bcrypt_salt_round));

  const updatedData = {
    password: hashedNewPassword,
    needsPasswordChange: false,
    passwordChangedAt: new Date(),
  };

  await User.findOneAndUpdate({ id: user?.id }, updatedData);
};

// alternate way to update password using instance

// const changePassword = async (
//   user: JwtPayload | null,
//   payload: IChangePassword
// ): Promise<void> => {
//   const { oldPassword, newPassword } = payload;

//   //alternative way
//   const isUserExist = await User.findOne({ id: user?.userId }).select(
//     '+password'
//   );

//   if (!isUserExist) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
//   }

//   // checking old password
//   if (
//     isUserExist.password &&
//     !(await User.isPasswordMatched(oldPassword, isUserExist.password))
//   ) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, 'Old Password is incorrect');
//   }

//   // data update
//   isUserExist.password = newPassword;
//   isUserExist.needsPasswordChange = false;

//   // updating using save()
//   isUserExist.save();
// };

export const AuthService = {
  loginUser,
  refreshToken,
  changePassword,
};
