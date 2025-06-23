import express from 'express';
import {
  changePassword,
  createUser,
  getAllUsers,
  updateUser,
} from '../controllers/userController.js';
import {
  authenticateToken,
  authorizeRole,
} from '../middlewares/authMiddleware.js';
import { USER_ROLES } from '../utils/roles.js';
import {
  changePasswordSchema,
  createUserSchema,
  updateUserSchema,
} from '../schemas/user.schema.js';
import { validateBody } from '../middlewares/validatePayload.js';

// Route: /users
const router = express.Router();

router.use(authenticateToken);

router.get('/', authorizeRole(USER_ROLES.admin), getAllUsers);
router.post(
  '/create',
  authorizeRole(USER_ROLES.admin),
  validateBody(createUserSchema),
  createUser,
);
router.post(
  '/update/:id',
  authorizeRole(USER_ROLES.admin),
  validateBody(updateUserSchema),
  updateUser,
);
router.put(
  '/change-password',
  validateBody(changePasswordSchema),
  changePassword,
);

export default router;
