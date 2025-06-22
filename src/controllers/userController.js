import bcrypt from 'bcryptjs';
import { prisma } from '../db/prismaClient.js';
import { USER_ROLES } from '../utils/roles.js';
import { validatePassword, validateUpdateUser } from '../utils/validation.js';

export const updateUser = async (req, res) => {
  const { id } = req.params
  const { email, role } = req.body

  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } })
    if (!user) return res.status(404).json({ error: 'User not found' })

    const data = {}
    if (email) data.email = email
    if (role) data.role = role

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data
    })

    res.json(updatedUser)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' })
  }
}

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

export const changePassword = async (req, res) => {
  const userId = req.user.id
  const { newPassword } = req.body

  if (validatePassword(newPassword)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long, contain one uppercase letter and one digit' })
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    })

    res.json({ message: 'Password updated successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update password' })
  }
}
