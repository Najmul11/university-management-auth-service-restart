/* eslint-disable no-console */
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { User } from '../users/user.model';
import { ILoginUser, ILoginUserResponse } from './auth.interface';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { jwtHelpers } from '../../../helpers/jwtHelpers';

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

  console.log(accessToken, refreshToken, needsPasswordChange);

  return {
    accessToken,
    refreshToken,
    needsPasswordChange,
  };
};

export const AuthService = {
  loginUser,
};
