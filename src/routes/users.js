import express from 'express';
import { changePassword, createUser, updateUser } from '../controllers/userController.js';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware.js';
import { USER_ROLES } from '../utils/roles.js';
import { validateIdParam, validateUpdateUser } from '../utils/validation.js';

const router = express.Router();
router.use(authenticateToken);

router.post('/create', authorizeRole(USER_ROLES.admin), createUser);
router.post('/update/:id', authorizeRole(USER_ROLES.admin), validateIdParam, validateUpdateUser, updateUser);
router.put('/change-password', changePassword)

// tmp
router.get('/dashboard', authorizeRole(USER_ROLES.admin), (req, res) => {
  res.json({ message: 'Only admins see this' })
})

export default router;
