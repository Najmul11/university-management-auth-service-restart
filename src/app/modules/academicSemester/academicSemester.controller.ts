import { Request, Response } from 'express';
import { AcademicSemesterService } from './academicSemester.service';
import catchAsyncError from '../../../shared/catchAsyncError';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

const createSemester = catchAsyncError(async (req: Request, res: Response) => {
  const { academicSemesterData } = req.body;
  const result =
    await AcademicSemesterService.createAcademicSemester(academicSemesterData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic semester created successfully',
    data: result,
  });
});

export const AcademicSemesterController = {
  createSemester,
};
