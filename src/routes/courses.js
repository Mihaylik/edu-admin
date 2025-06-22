import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { authorizeAdminOrCourseTeacher } from '../middlewares/roleMiddleware.js';
import {
  addStudentToCourse,
  getStudentsOfCourse,
  removeStudentFromCourse,
} from '../controllers/studentCourceController.js';

const router = express.Router();

router.use(authenticateToken);

// fot the StudentsCources
router.post(
  '/:id/students/:studentId',
  authorizeAdminOrCourseTeacher,
  addStudentToCourse,
);
router.delete(
  '/:id/students/:studentId',
  authorizeAdminOrCourseTeacher,
  removeStudentFromCourse,
);
router.get(
  '/:id/students',
  // TODO: may be will accept this also for students and than remove this middleware
  authorizeAdminOrCourseTeacher,
  getStudentsOfCourse,
);
