import { z } from 'zod';
import {
  academicSemesterCodes,
  academicSemesterMonths,
  academicSemesterTitles,
} from './academicSemester.constants';

const createAcademicSemesterZodSchema = z.object({
  body: z.object({
    academicSemesterData: z.object({
      title: z.enum([...academicSemesterTitles] as [string, ...string[]], {
        required_error: 'Title is required',
      }),
      year: z.string({
        required_error: 'Year is required ',
      }),
      code: z.enum([...academicSemesterCodes] as [string, ...string[]]),
      startMonth: z.enum([...academicSemesterMonths] as [string, ...string[]], {
        required_error: 'Start month is needed',
      }),
      endMonth: z.enum([...academicSemesterMonths] as [string, ...string[]], {
        required_error: 'End month is needed',
      }),
    }),
  }),
});

const updateAcademicSemesterZodSchema = z.object({
  body: z
    .object({
      title: z
        .enum([...academicSemesterTitles] as [string, ...string[]])
        .optional(),
      year: z.string().optional(),
      code: z
        .enum([...academicSemesterCodes] as [string, ...string[]])
        .optional(),
      startMonth: z
        .enum([...academicSemesterMonths] as [string, ...string[]])
        .optional(),
      endMonth: z
        .enum([...academicSemesterMonths] as [string, ...string[]])
        .optional(),
    })
    .refine(data => (data.title && data.code) || (!data.title && !data.code), {
      message: 'Either both title and code should be provided or neither',
    }),
});

export const AcademicSemesterValidation = {
  createAcademicSemesterZodSchema,
  updateAcademicSemesterZodSchema,
};
