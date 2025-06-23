import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { authorizeAdminOrCourseTeacher } from '../middlewares/roleMiddleware.js';
import {
  addStudentsToCourse,
  addStudentToCourse,
  getStudentsOfCourse,
  removeStudentFromCourse,
} from '../controllers/studentCourceController.js';
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/courseController.js';
import { authorizeRole } from '../middlewares/authMiddleware.js';
import { USER_ROLES } from '../utils/roles.js';
import {
  validateBody,
  validateParams,
} from '../middlewares/validatePayload.js';
import {
  courseIdParamsSchema,
  createCourseSchema,
  updateCourseSchema,
} from '../schemas/course.schema.js';
import {
  addStudentsToCourseSchema,
  studentCourseIdParamsSchema,
  studentCourseParamsSchema,
} from '../schemas/studentCourse.schema.js';

// Route: /courses
const router = express.Router();

router.use(authenticateToken);

router.get(
  '/',
  authorizeRole(USER_ROLES.admin, USER_ROLES.teacher),
  getAllCourses,
);
router.get(
  '/:id',
  authorizeRole(USER_ROLES.admin, USER_ROLES.teacher),
  validateParams(studentCourseParamsSchema),
  getCourseById,
);

router.post(
  '/',
  authorizeRole(USER_ROLES.admin),
  validateBody(createCourseSchema),
  createCourse,
);
router.put(
  '/:id',
  authorizeAdminOrCourseTeacher,
  validateBody(updateCourseSchema),
  validateParams(courseIdParamsSchema),
  updateCourse,
);
router.delete(
  '/:id',
  authorizeRole(USER_ROLES.admin),
  validateParams(courseIdParamsSchema),
  deleteCourse,
);

// fot the StudentsCourses
router.get(
  '/:id/students',
  // TODO: may be will accept this also for students and than remove this middleware
  authorizeAdminOrCourseTeacher,
  validateParams(studentCourseIdParamsSchema),
  getStudentsOfCourse,
);

router.post(
  '/:id/students/:studentId',
  authorizeAdminOrCourseTeacher,
  validateParams(studentCourseParamsSchema),
  addStudentToCourse,
);
router.post(
  '/:id/add-students/',
  authorizeAdminOrCourseTeacher,
  validateBody(addStudentsToCourseSchema),
  addStudentsToCourse,
);
router.delete(
  '/:id/students/:studentId',
  authorizeAdminOrCourseTeacher,
  validateParams(studentCourseParamsSchema),
  removeStudentFromCourse,
);

export default router;
