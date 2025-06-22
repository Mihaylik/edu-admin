import { prisma } from '../db/prismaClient';

// for StudentCources
export const addStudentToCourse = async (req, res) => {
  const courseId = parseInt(req.params.id, 10);
  const studentId = parseInt(req.params.studentId, 10);

  const student = await prisma.user.findUnique({
    where: { id: studentId },
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
      studentId,
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
      studentId,
    },
  });

  return res.status(201).json({ message: 'Student added to course' });
};

export const removeStudentFromCourse = async (req, res) => {
  const courseId = parseInt(req.params.id, 10);
  const studentId = parseInt(req.params.studentId, 10);

  const deleted = await prisma.studentCourse.deleteMany({
    where: {
      courseId,
      studentId,
    },
  });

  if (deleted.count === 0) {
    return res.status(404).json({ error: 'Student not found in this course' });
  }

  return res.json({ message: 'Student removed from course' });
};

export const getStudentsOfCourse = async (req, res) => {
  const courseId = parseInt(req.params.id, 10);

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
