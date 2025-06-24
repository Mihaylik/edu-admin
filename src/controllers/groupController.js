import { prisma } from '../db/prismaClient.js';
import {
  createGroupSchema,
  updateGroupSchema,
  groupIdParamsSchema,
} from '../schemas/group.schema.js';

export const getAllGroups = async (req, res) => {
  try {
    const groups = await prisma.group.findMany({
      select: {
        id: true,
        name: true,
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

    const result = groups.map((group) => ({
      id: group.id,
      name: group.name,
      members: group.members.map((m) => m.student),
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
};

export const getGroupById = async (req, res) => {
  const parsed = groupIdParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const id = parseInt(parsed.data.id, 10);
  try {
    const group = await prisma.group.findUnique({
      where: { id },
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
    res.json({ id: group.id, name: group.name, members });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch group' });
  }
};

export const createGroup = async (req, res) => {
  const parsed = createGroupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { name, studentIds } = parsed.data;
  try {
    const data = { name };
    if (studentIds && studentIds.length) {
      const students = await prisma.user.findMany({
        where: { id: { in: studentIds }, role: 'STUDENT' },
        select: { id: true },
      });
      if (students.length !== studentIds.length) {
        return res
          .status(400)
          .json({ error: 'One or more students not found or not STUDENT' });
      }
      data.members = {
        create: studentIds.map((studentId) => ({ studentId })),
      };
    }
    const group = await prisma.group.create({
      data,
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
    res.status(201).json({
      id: group.id,
      name: group.name,
      members: group.members.map((gm) => gm.student),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create group' });
  }
};

export const updateGroup = async (req, res) => {
  const paramsParsed = groupIdParamsSchema.safeParse(req.params);
  if (!paramsParsed.success) {
    return res.status(400).json({ error: paramsParsed.error.flatten() });
  }
  const bodyParsed = updateGroupSchema.safeParse(req.body);
  if (!bodyParsed.success) {
    return res.status(400).json({ error: bodyParsed.error.flatten() });
  }
  const id = parseInt(paramsParsed.data.id, 10);
  const { name, studentIds } = bodyParsed.data;

  try {
    const group = await prisma.group.findUnique({
      where: { id },
      include: { members: true },
    });
    if (!group) return res.status(404).json({ error: 'Group not found' });

    const data = {};
    if (name !== undefined) {
      data.name = name;
    }
    if (studentIds) {
      const students = await prisma.user.findMany({
        where: { id: { in: studentIds }, role: 'STUDENT' },
        select: { id: true },
      });
      if (students.length !== studentIds.length) {
        return res
          .status(400)
          .json({ error: 'One or more students not found or not STUDENT' });
      }
      data.members = {
        create: studentIds.map((studentId) => ({ studentId })),
      };
      await prisma.groupMember.deleteMany({ where: { groupId: id } });
    }

    if (data.name || data.members) {
      await prisma.group.update({
        where: { id },
        data,
      });
    }

    const updatedGroup = await prisma.group.findUnique({
      where: { id },
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

    res.json({
      id: updatedGroup.id,
      name: updatedGroup.name,
      members: updatedGroup.members.map((gm) => gm.student),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update group' });
  }
};

export const deleteGroup = async (req, res) => {
  const parsed = groupIdParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const id = parseInt(parsed.data.id, 10);
  try {
    const group = await prisma.group.findUnique({ where: { id } });
    if (!group) return res.status(404).json({ error: 'Group not found' });

    await prisma.group.delete({ where: { id } });
    res.status(204).json({ message: 'Group deleted' });
  } catch (error) {
    console.log({ error });

    res.status(500).json({ error: 'Failed to delete group' });
  }
};
