/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose';
import { IUser, IUserMethods, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../../config';

const UserSchema = new Schema<IUser, Record<string, unknown>, IUserMethods>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
    },
    faculty: {
      type: Schema.Types.ObjectId,
      ref: 'faculty',
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  { timestamps: true },
);

UserSchema.methods.isUserExist = async function (id: string): Promise<Partial<IUser> | null> {
  return await User.findOne({ id }, { id: 1, needsPasswordChange: 1, role: 1 });
};

UserSchema.methods.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

// hash password
UserSchema.pre('save', async function (next) {
  const user = this;
  user.password = await bcrypt.hash(this.password, Number(config.bcrypt_salt_round));
  next();
});

export const User = model<IUser, UserModel>('User', UserSchema);
