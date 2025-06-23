import express from 'express';
import { login } from '../controllers/authController.js';

// Route: /auth
const router = express.Router();

router.post('/login', login);

export default router;
