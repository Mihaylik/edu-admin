import { Router } from 'express';
import {
  createSchedule,
  deleteSchedule,
  getAllSchedules,
  getStudentSchedule,
  updateSchedule,
} from '../controllers/scheduleController.js';
import {
  validateBody,
  validateParams,
} from '../middlewares/validatePayload.js';
import { USER_ROLES } from '../utils/roles.js';
import {
  createScheduleSchema,
  updateScheduleSchema,
  scheduleIdParamSchema,
  scheduleStudentIdParamSchema,
} from '../schemas/schedule.schema.js';
import {
  authenticateToken,
  authorizeRole,
} from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getAllSchedules);
router.get(
  '/student/:studentId',
  validateParams(scheduleStudentIdParamSchema),
  getStudentSchedule,
);
router.post(
  '/',
  authorizeRole(USER_ROLES.admin),
  validateBody(createScheduleSchema),
  createSchedule,
);
router.put(
  '/:id',
  authorizeRole(USER_ROLES.admin),
  validateParams(scheduleIdParamSchema),
  validateBody(updateScheduleSchema),
  updateSchedule,
);
router.delete(
  '/:id',
  authorizeRole(USER_ROLES.admin),
  validateParams(scheduleIdParamSchema),
  deleteSchedule,
);

export default router;
