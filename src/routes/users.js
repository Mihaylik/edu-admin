import express from 'express';
import { createUser } from '../controllers/userController.js';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware.js';
import { USER_ROLES } from '../utils/roles.js';

const router = express.Router();

router.post('/create',  authenticateToken, authorizeRole([USER_ROLES.admin]), createUser);


// tmp
router.get('/dashboard', authenticateToken, authorizeRole([USER_ROLES.admin]), (req, res) => {
  res.json({ message: 'Only admins see this' })
})

export default router;
