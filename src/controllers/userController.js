import bcrypt from 'bcryptjs';
import { prisma } from '../db/prismaClient.js';
import {
  createUserSchema,
  updateUserSchema,
  changePasswordSchema,
} from '../schemas/user.schema.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const parsed = updateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: parsed.data,
    });
    const { password, ...updatedUserData } = updatedUser;

    res.json(updatedUserData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

export const createUser = async (req, res) => {
  const parsed = createUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { email, password, role } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ error: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role,
    },
  });

  res.status(201).json({ id: user.id, email: user.email, role: user.role });
};

export const changePassword = async (req, res) => {
  const userId = req.user.userId;

  const parsed = changePasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const hashedPassword = await bcrypt.hash(parsed.data.newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.log({ error });

    res.status(500).json({ error: 'Failed to update password' });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const currentUserId = req.user.userId;

  if (parseInt(id, 10) === currentUserId) {
    return res
      .status(400)
      .json({ error: 'You cannot delete your own account' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await prisma.user.delete({ where: { id: parseInt(id) } });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
