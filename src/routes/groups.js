import express from 'express';
import {
  authenticateToken,
  authorizeRole,
} from '../middlewares/authMiddleware';
import {
  createGroupSchema,
  groupIdParamsSchema,
  updateGroupSchema,
} from '../schemas/group.schema';
import {
  createGroup,
  deleteGroup,
  getAllGroups,
  getGroupById,
  updateGroup,
} from '../controllers/groupController';
import { USER_ROLES } from '../utils/roles';
import { validateParams } from '../middlewares/validatePayload';
import { groupMemberParamsSchema } from '../schemas/groupMember.schema';
import {
  addStudentToGroup,
  getGroupMembers,
  removeStudentFromGroup,
} from '../controllers/groupMemberController';

// Route: /groups
const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllGroups);
router.get('/:id', validateParams(groupIdParamsSchema), getGroupById);

router.post(
  '/',
  authorizeRole(USER_ROLES.admin),
  validateBody(createGroupSchema),
  createGroup,
);
router.put(
  '/:id',
  authorizeRole(USER_ROLES.admin),
  validateParams(groupIdParamsSchema),
  validateBody(updateGroupSchema),
  updateGroup,
);
router.delete(
  '/:id',
  authorizeRole(USER_ROLES.admin),
  validateParams(groupIdParamsSchema),
  deleteGroup,
);

// Route /group/:id/members
router.get(
  '/:id/members',
  validateParams(groupIdParamsSchema),
  getGroupMembers,
);

router.post(
  '/:id/members/:studentId',
  validateParams(groupMemberParamsSchema),
  addStudentToGroup,
);
router.delete(
  '/:id/members/:studentId',
  validateParams(groupMemberParamsSchema),
  removeStudentFromGroup,
);

export default router;
