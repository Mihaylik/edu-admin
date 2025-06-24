import express from 'express';
import {
  createOrUpdateGrade,
  getGradesForStudentInCourse,
  getAllGradesForCourse,
  deleteGrade,
  getAllGradesForStudent,
} from '../controllers/gradeController.js';
import {
  validateBody,
  validateParams,
} from '../middlewares/validatePayload.js';
import {
  courseIdParamsSchema,
  createOrUpdateGradeSchema,
  gradeCourseStudentParamsSchema,
  gradeIdParamsSchema,
  studentIdParamsSchema,
} from '../schemas/grade.schema.js';
import {
  authenticateToken,
  authorizeRole,
} from '../middlewares/authMiddleware.js';
import { USER_ROLES } from '../utils/roles.js';

const router = express.Router();

router.use(authenticateToken);

router.post(
  '/',
  authorizeRole(USER_ROLES.admin, USER_ROLES.teacher),
  validateBody(createOrUpdateGradeSchema),
  createOrUpdateGrade,
);

router.get(
  '/course/:courseId/student/:studentId',
  validateParams(gradeCourseStudentParamsSchema),
  getGradesForStudentInCourse,
);

router.get(
  '/course/:courseId',
  validateParams(courseIdParamsSchema),
  getAllGradesForCourse,
);

router.get(
  '/student/:studentId',
  validateParams(studentIdParamsSchema),
  getAllGradesForStudent,
);

router.delete(
  '/:id',
  authorizeRole(USER_ROLES.admin, USER_ROLES.teacher),
  validateParams(gradeIdParamsSchema),
  deleteGrade,
);

export default router;
