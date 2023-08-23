import { Request, Response } from 'express';
import { AcademicSemesterService } from './academicSemester.service';
import catchAsyncError from '../../../shared/catchAsyncError';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { IAcademicSemester } from './academicSemester.interface';
import { academicSemesterFilterableFields } from './academicSemester.constants';

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

const getAllSemesters = catchAsyncError(async (req: Request, res: Response) => {
  const filters = pick(req.query, academicSemesterFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await AcademicSemesterService.getAllSemesters(
    filters,
    paginationOptions,
  );

  sendResponse<IAcademicSemester[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic semesters  retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleSemester = catchAsyncError(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AcademicSemesterService.getSingleSemester(id);

    sendResponse<IAcademicSemester>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: ' Semester retrieved  successfully',
      data: result,
    });
  },
);

const updateSemester = catchAsyncError(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedData = req.body;

  const result = await AcademicSemesterService.updateSemester(id, updatedData);

  sendResponse<IAcademicSemester>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ' Semester updated  successfully',
    data: result,
  });
});

const deleteSemester = catchAsyncError(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await AcademicSemesterService.deleteSemester(id);

  sendResponse<IAcademicSemester>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ' Semester deleted successfully',
    data: result,
  });
});
export const AcademicSemesterController = {
  createSemester,
  getAllSemesters,
  getSingleSemester,
  updateSemester,
  deleteSemester,
};
