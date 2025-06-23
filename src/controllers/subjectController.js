import { prisma } from '../db/prismaClient.js';
import {
  createSubjectSchema,
  updateSubjectSchema,
  assignTeacherToSubjectParamsSchema,
} from '../schemas/subject.schema.js';

export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
};

export const createSubject = async (req, res) => {
  const parsed = createSubjectSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const newSubject = await prisma.subject.create({ data: parsed.data });
    res.status(201).json(newSubject);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create subject' });
  }
};

export const updateSubject = async (req, res) => {
  const parsed = updateSubjectSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { id } = req.params;
  try {
    const existing = await prisma.subject.findUnique({
      where: { id: Number(id) },
    });
    if (!existing) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    const updated = await prisma.subject.update({
      where: { id: Number(id) },
      data: parsed.data,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update subject' });
  }
};

export const deleteSubject = async (req, res) => {
  const { id } = req.params;
  try {
    const existing = await prisma.subject.findUnique({
      where: { id: Number(id) },
    });
    if (!existing) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    await prisma.subject.delete({ where: { id: Number(id) } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete subject' });
  }
};

export const assignTeacherToSubject = async (req, res) => {
  const parsed = assignTeacherToSubjectParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { id, teacherId } = parsed.data;
  try {
    const subject = await prisma.subject.findUnique({
      where: { id: parseInt(id) },
    });
    if (!subject) return res.status(404).json({ error: 'Subject not found' });

    const teacher = await prisma.user.findUnique({
      where: { id: parseInt(teacherId) },
    });
    if (!teacher || teacher.role !== 'TEACHER') {
      return res
        .status(400)
        .json({ error: 'Invalid teacher ID or user is not a teacher' });
    }

    await prisma.course.updateMany({
      where: { subjectId: parseInt(id) },
      data: { teacherId: parseInt(teacherId) },
    });

    res.json({ message: 'Teacher assigned to all courses for this subject' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign teacher' });
  }
};
