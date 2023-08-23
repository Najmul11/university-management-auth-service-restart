import { Model, Types } from 'mongoose';
import { IStudent } from '../student/student.interface';

export type IUser = {
  id: string | undefined;
  role: string;
  password: string;
  student?: Types.ObjectId | IStudent;
};

export type UserModel = Model<IUser, object>;
