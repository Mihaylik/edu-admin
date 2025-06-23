import { prisma } from '../db/prismaClient.js';
import { USER_ROLES } from '../utils/roles.js';
import {
  createCourseSchema,
  updateCourseSchema,
  courseIdParamsSchema,
} from '../schemas/course.schema.js';

export const getAllCourses = async (req, res) => {
  const { role, userId } = req.user;
  const where = role === USER_ROLES.teacher ? { teacherId: userId } : {};

  const courses = await prisma.course.findMany({
    where,
    include: {
      subject: { select: { id: true, name: true } },
      teacher: { select: { id: true, email: true } },
    },
  });

  res.json(courses);
};

export const getCourseById = async (req, res) => {
  const parsed = courseIdParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const id = parseInt(parsed.data.id, 10);
  const { role, userId } = req.user;

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      subject: true,
      teacher: true,
    },
  });

  if (!course) return res.status(404).json({ error: 'Course not found' });

  if (role === USER_ROLES.teacher && course.teacherId !== userId) {
    return res.status(403).json({ error: 'Access denied: Not your course' });
  }

  res.json(course);
};

export const createCourse = async (req, res) => {
  const parsed = createCourseSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { name, subjectId, teacherId } = parsed.data;

  const subject = await prisma.subject.findUnique({ where: { id: subjectId } });
  if (!subject) {
    return res.status(400).json({ error: 'Invalid subject ID' });
  }
  const teacher = await prisma.user.findUnique({ where: { id: teacherId } });
  if (!teacher || teacher.role !== USER_ROLES.teacher) {
    return res.status(400).json({ error: 'Invalid teacher ID' });
  }

  const newCourse = await prisma.course.create({
    data: { name, subjectId, teacherId },
  });

  res.status(201).json(newCourse);
};

export const updateCourse = async (req, res) => {
  const paramsParsed = courseIdParamsSchema.safeParse(req.params);
  if (!paramsParsed.success) {
    return res.status(400).json({ error: paramsParsed.error.flatten() });
  }
  const bodyParsed = updateCourseSchema.safeParse(req.body);
  if (!bodyParsed.success) {
    return res.status(400).json({ error: bodyParsed.error.flatten() });
  }

  const id = parseInt(paramsParsed.data.id, 10);
  const { role, userId } = req.user;

  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) return res.status(404).json({ error: 'Course not found' });

  if (role === USER_ROLES.teacher && course.teacherId !== userId) {
    return res.status(403).json({ error: 'Access denied: Not your course' });
  }

  const updated = await prisma.course.update({
    where: { id },
    data: bodyParsed.data,
  });

  res.json(updated);
};

export const deleteCourse = async (req, res) => {
  const parsed = courseIdParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const id = parseInt(parsed.data.id, 10);

  try {
    await prisma.course.delete({
      where: { id },
    });

    res.json({ message: 'Course deleted' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
};
