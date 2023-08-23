import httpStatus from 'http-status';
import catchAsyncError from '../../../shared/catchAsyncError';
import sendResponse from '../../../shared/sendResponse';
import { IStudent } from './student.interface';
import { Request, Response } from 'express';
import pick from '../../../shared/pick';
import { studentFilterableFields } from './student.constant';
import { paginationFields } from '../../../constants/pagination';
import { StudentService } from './student.service';

const getAllStudents = catchAsyncError(async (req: Request, res: Response) => {
  const filters = pick(req.query, studentFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await StudentService.getAllStudents(
    filters,
    paginationOptions,
  );

  sendResponse<IStudent[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Students  retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleStudent = catchAsyncError(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await StudentService.getSingleStudent(id);

    sendResponse<IStudent>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: ' Student retrieved  successfully',
      data: result,
    });
  },
);

const updateStudent = catchAsyncError(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedData = req.body;

  const result = await StudentService.updateStudent(id, updatedData);

  sendResponse<IStudent>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ' Student updated  successfully',
    data: result,
  });
});

const deleteStudent = catchAsyncError(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await StudentService.deleteStudent(id);

  sendResponse<IStudent>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ' Student deleted successfully',
    data: result,
  });
});
export const StudentController = {
  getAllStudents,
  getSingleStudent,
  updateStudent,
  deleteStudent,
};
