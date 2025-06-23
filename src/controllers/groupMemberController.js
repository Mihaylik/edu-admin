import { prisma } from '../db/prismaClient.js';
import { USER_ROLES } from '../utils/roles.js';
import {
  groupIdParamsSchema,
  groupMemberParamsSchema,
} from '../schemas/groupMember.schema.js';

export const getGroupMembers = async (req, res) => {
  const parsed = groupIdParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const groupId = parseInt(parsed.data.id, 10);

  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      members: {
        include: {
          student: {
            select: {
              id: true,
              email: true,
              role: true,
              createdAt: true,
            },
          },
        },
      },
    },
  });

  if (!group) return res.status(404).json({ error: 'Group not found' });

  const members = group.members.map((gm) => gm.student);

  res.json(members);
};

export const addStudentToGroup = async (req, res) => {
  const parsed = groupMemberParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const groupId = parseInt(parsed.data.id, 10);
  const studentId = parseInt(parsed.data.studentId, 10);

  const group = await prisma.group.findUnique({ where: { id: groupId } });
  if (!group) return res.status(404).json({ error: 'Group not found' });

  const student = await prisma.user.findUnique({ where: { id: studentId } });
  if (!student || student.role !== USER_ROLES.student) {
    return res.status(400).json({ error: 'User is not a student' });
  }

  const exists = await prisma.groupMember.findFirst({
    where: { groupId, studentId },
  });
  if (exists) {
    return res.status(409).json({ error: 'Student already in group' });
  }

  await prisma.groupMember.create({
    data: { groupId, studentId },
  });

  res.status(201).json({ message: 'Student added to group' });
};

export const removeStudentFromGroup = async (req, res) => {
  const parsed = groupMemberParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const groupId = parseInt(parsed.data.id, 10);
  const studentId = parseInt(parsed.data.studentId, 10);

  const deleted = await prisma.groupMember.deleteMany({
    where: { groupId, studentId },
  });

  if (deleted.count === 0) {
    return res.status(404).json({ error: 'Student not found in group' });
  }

  res.json({ message: 'Student removed from group' });
};
