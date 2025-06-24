import { Router } from 'express';
import {
  createAttendance,
  updateAttendance,
  getAttendances,
} from '../controllers/attendanceController.js';
import {
  validateBody,
  validateParams,
} from '../middlewares/validatePayload.js';
import {
  createAttendanceSchema,
  updateAttendanceSchema,
  attendanceIdParamsSchema,
} from '../schemas/attendance.schema.js';
import {
  authenticateToken,
  authorizeRole,
} from '../middlewares/authMiddleware.js';
import { USER_ROLES } from '../utils/roles.js';

const router = Router();

router.use(authenticateToken);

router.get(
  '/',
  authorizeRole(USER_ROLES.admin, USER_ROLES.teacher),
  getAttendances,
);

router.post(
  '/',
  authorizeRole(USER_ROLES.admin, USER_ROLES.teacher),
  validateBody(createAttendanceSchema),
  createAttendance,
);
router.put(
  '/:id',
  authorizeRole(USER_ROLES.admin, USER_ROLES.teacher),
  validateParams(attendanceIdParamsSchema),
  validateBody(updateAttendanceSchema),
  updateAttendance,
);

export default router;
