import express from 'express';
import { StudentController } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { StudentValidaion } from './student.validation';
const router = express.Router();

router.get('/:id', StudentController.getSingleStudent);
router.patch(
  '/:id',
  validateRequest(StudentValidaion.updateStudentZodSchema),
  StudentController.updateStudent,
);
router.delete('/:id', StudentController.deleteStudent);
router.get('/', StudentController.getAllStudents);

export const StudentRoutes = router;
