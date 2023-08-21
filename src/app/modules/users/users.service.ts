import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { IUser } from './users.interface';
import { User } from './users.model';
import { gererateUserId } from './users.utils';

const createUser = async (user: IUser): Promise<IUser | null> => {
  //  auto generated incremental id
  const id = await gererateUserId();

  user.id = id;
  // default password
  if (!user.password) {
    user.password = config.default_user_pass as string;
  }
  const createdUser = User.create(user);
  if (!createdUser) {
    throw new ApiError(400, 'failed to create user');
  }
  return createdUser;
};
export const UserService = {
  createUser,
};
