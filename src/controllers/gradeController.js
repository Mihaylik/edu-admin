import { prisma } from '../db/prismaClient.js';
import {
  courseIdParamsSchema,
  createOrUpdateGradeSchema,
  gradeCourseStudentParamsSchema,
  gradeIdParamsSchema,
  studentIdParamsSchema,
} from '../schemas/grade.schema.js';
import { USER_ROLES } from '../utils/roles.js';

export const createOrUpdateGrade = async (req, res) => {
  const parsed = createOrUpdateGradeSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { studentId, courseId, value } = parsed.data;
  const { role, userId } = req.user;

  try {
    if (role === USER_ROLES.teacher) {
      const course = await prisma.course.findUnique({
        where: { id: courseId },
        select: { teacherId: true },
      });

      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }

      if (course.teacherId !== userId) {
        return res
          .status(403)
          .json({ error: 'Access denied: Not your course' });
      }
    }

    const existing = await prisma.grade.findFirst({
      where: { studentId, courseId },
    });

    if (existing) {
      const updated = await prisma.grade.update({
        where: { id: existing.id },
        data: { value, date: new Date() },
      });
      return res.json(updated);
    }

    const created = await prisma.grade.create({
      data: { studentId, courseId, value, date: new Date() },
    });
    res.status(201).json(created);
  } catch (error) {
    console.log({ error });

    res.status(500).json({ error: 'Failed to save grade' });
  }
};

export const getGradesForStudentInCourse = async (req, res) => {
  const parsed = gradeCourseStudentParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { courseId, studentId } = parsed.data;

  try {
    const grades = await prisma.grade.findMany({
      where: { courseId: Number(courseId), studentId: Number(studentId) },
    });
    res.json(grades);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch grades' });
  }
};

export const getAllGradesForCourse = async (req, res) => {
  const parsed = courseIdParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const courseId = Number(parsed.data.courseId);

  try {
    const grades = await prisma.grade.findMany({
      where: { courseId },
      include: {
        student: {
          select: { id: true, email: true, role: true },
        },
      },
    });
    res.json(grades);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch grades' });
  }
};

export const getAllGradesForStudent = async (req, res) => {
  const parsed = studentIdParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const studentId = Number(parsed.data.studentId);

  try {
    const grades = await prisma.grade.findMany({
      where: { studentId },
      include: {
        course: {
          select: { id: true, name: true },
        },
      },
    });

    const result = grades.map((g) => ({
      courseId: g.course.id,
      name: g.course.name,
      value: g.value,
      date: g.date,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch grades' });
  }
};

export const deleteGrade = async (req, res) => {
  const parsed = gradeIdParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { id } = parsed.data;
  const { role, userId } = req.user;

  try {
    const existing = await prisma.grade.findUnique({
      where: { id: Number(id) },
      include: { course: { select: { teacherId: true } } },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Grade not found' });
    }

    if (role === USER_ROLES.teacher && existing.course.teacherId !== userId) {
      return res.status(403).json({ error: 'Access denied: Not your course' });
    }

    await prisma.grade.delete({ where: { id: Number(id) } });

    res.json({ message: 'Grade deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete grade' });
  }
};
