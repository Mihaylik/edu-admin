import express from 'express';
import {
  createSubject,
  getAllSubjects,
  updateSubject,
  deleteSubject,
  assignTeacherToSubject,
} from '../controllers/subjectController.js';

import {
  authenticateToken,
  authorizeRole,
} from '../middlewares/authMiddleware.js';
import {
  validateIdParam,
  validateSubjectPayload,
} from '../utils/validation.js';
import { authorizeAdminOrTeacherForSubject } from '../middlewares/roleMiddleware.js';
import { USER_ROLES } from '../utils/roles.js';
import {
  validateBody,
  validateParams,
} from '../middlewares/validatePayload.js';
import {
  assignTeacherToSubjectParamsSchema,
  createSubjectSchema,
  updateSubjectSchema,
} from '../schemas/subject.schema.js';

// Route: /subjects
const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllSubjects);
router.post(
  '/',
  authorizeRole(USER_ROLES.admin),
  validateBody(createSubjectSchema),
  createSubject,
);

router.put(
  '/:id',
  authorizeAdminOrTeacherForSubject,
  validateBody(updateSubjectSchema),
  updateSubject,
);
router.put(
  '/:id/assign-teacher/:teacherId',
  authorizeRole(USER_ROLES.admin),
  validateParams(assignTeacherToSubjectParamsSchema),
  assignTeacherToSubject,
);
router.delete('/:id', deleteSubject);

export default router;
