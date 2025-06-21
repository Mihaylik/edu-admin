import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from '../db/prismaClient.js'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret'
const JWT_EXPIRES_IN = '2h'

export const login = async (req, res) => {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' })

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

  res.json({ token })
}
