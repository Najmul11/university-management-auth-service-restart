import { Request, Response } from 'express';
import catchAsyncError from '../../../shared/catchAsyncError';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { AuthService } from './auth.service';
import { ILoginUserResponse } from './auth.interface';

const loginUser = catchAsyncError(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;

  const result = await AuthService.loginUser(loginData);

  sendResponse<ILoginUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user logged in successfully!',
    data: result,
  });
});

export const AuthController = {
  loginUser,
};
