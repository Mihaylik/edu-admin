import { prisma } from '../db/prismaClient.js';
import { USER_ROLES } from '../utils/roles.js';
import {
  studentCourseParamsSchema,
  studentCourseIdParamsSchema,
  addStudentsToCourseSchema,
} from '../schemas/studentCourse.schema.js';

export const addStudentToCourse = async (req, res) => {
  const parsed = studentCourseParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { id, studentId } = parsed.data;
  const courseId = parseInt(id, 10);
  const studentIdNum = parseInt(studentId, 10);

  const student = await prisma.user.findUnique({
    where: { id: studentIdNum },
  });

  if (!student) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (student.role !== USER_ROLES.student) {
    return res.status(400).json({ error: 'User is not a student' });
  }

  const existing = await prisma.studentCourse.findFirst({
    where: {
      courseId,
      studentId: studentIdNum,
    },
  });

  if (existing) {
    return res
      .status(409)
      .json({ error: 'Student already enrolled in this course' });
  }

  await prisma.studentCourse.create({
    data: {
      courseId,
      studentId: studentIdNum,
    },
  });

  return res.status(201).json({ message: 'Student added to course' });
};

export const addStudentsToCourse = async (req, res) => {
  const paramsParsed = studentCourseIdParamsSchema.safeParse(req.params);
  if (!paramsParsed.success) {
    return res.status(400).json({ error: paramsParsed.error.flatten() });
  }
  const bodyParsed = addStudentsToCourseSchema.safeParse(req.body);
  if (!bodyParsed.success) {
    return res.status(400).json({ error: bodyParsed.error.flatten() });
  }

  const courseId = parseInt(paramsParsed.data.id, 10);
  const { studentIds } = bodyParsed.data;

  const students = await prisma.user.findMany({
    where: { id: { in: studentIds }, role: 'STUDENT' },
    select: { id: true },
  });
  if (students.length !== studentIds.length) {
    return res
      .status(400)
      .json({ error: 'One or more students not found or not STUDENT' });
  }

  const existingLinks = await prisma.studentCourse.findMany({
    where: {
      courseId,
      studentId: { in: studentIds },
    },
    select: { studentId: true },
  });
  const existingStudentIds = existingLinks.map((l) => l.studentId);
  const newStudentIds = studentIds.filter(
    (id) => !existingStudentIds.includes(id),
  );

  if (newStudentIds.length === 0) {
    return res
      .status(409)
      .json({ error: 'All students already enrolled in this course' });
  }

  await Promise.all(
    newStudentIds.map((studentId) =>
      prisma.studentCourse.create({
        data: { courseId, studentId },
      }),
    ),
  );

  return res
    .status(201)
    .json({ message: 'Students added to course', added: newStudentIds });
};

export const removeStudentFromCourse = async (req, res) => {
  const parsed = studentCourseParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { id, studentId } = parsed.data;
  const courseId = parseInt(id, 10);
  const studentIdNum = parseInt(studentId, 10);

  const deleted = await prisma.studentCourse.deleteMany({
    where: {
      courseId,
      studentId: studentIdNum,
    },
  });

  if (deleted.count === 0) {
    return res.status(404).json({ error: 'Student not found in this course' });
  }

  return res.json({ message: 'Student removed from course' });
};

export const getStudentsOfCourse = async (req, res) => {
  const parsed = studentCourseIdParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { id } = parsed.data;
  const courseId = parseInt(id, 10);

  const students = await prisma.studentCourse.findMany({
    where: { courseId },
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
  });

  const result = students.map((entry) => entry.student);

  res.json(result);
};
