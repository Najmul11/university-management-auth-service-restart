import express from 'express';
import { AcademicSemesterRoutes } from '../modules/academicSemester/academicSemester.route';
import { UserRoutes } from '../modules/users/user.route';
import { AcademicFacultyRoutes } from '../modules/academicFaculty/academicFaculty.route';
import { academicDepartmentRoutes } from '../modules/academicDepartment/academicDepartment.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/academic-semesters',
    route: AcademicSemesterRoutes,
  },
  {
    path: '/academic-faculty',
    route: AcademicFacultyRoutes,
  },
  {
    path: '/academic-department',
    route: academicDepartmentRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export const routes = router;
