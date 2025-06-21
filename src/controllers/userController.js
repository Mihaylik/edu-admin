import bcrypt from 'bcryptjs';
import { prisma } from '../db/prismaClient.js';
import { USER_ROLES } from '../utils/roles.js';

export const createUser = async (req, res) => {
  const { email, password, role } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ error: 'User already exists' });

  const validRoles = Object.values(USER_ROLES)
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role' })
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role
    }
  });

  res.status(201).json({ id: user.id, email: user.email, role: user.role });
};
