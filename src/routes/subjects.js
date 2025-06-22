import express from 'express';
import {
  createSubject,
  getAllSubjects,
  updateSubject,
  deleteSubject,
} from '../controllers/subjectController.js';

import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware.js';
import { validateSubjectPayload } from '../utils/validation.js';
import { authorizeAdminOrTeacherForCourse } from '../middlewares/roleMiddleware.js';
import { USER_ROLES } from '../utils/roles.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllSubjects);

router.post('/', validateSubjectPayload, authorizeRole([USER_ROLES.admin]), createSubject);

router.put('/:id', validateSubjectPayload, authorizeAdminOrTeacherForCourse, updateSubject);

router.delete('/:id', deleteSubject);

export default router;
