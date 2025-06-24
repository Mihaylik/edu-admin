import { prisma } from '../db/prismaClient.js';
import {
  createAttendanceSchema,
  updateAttendanceSchema,
  attendanceQuerySchema,
  attendanceIdParamsSchema,
} from '../schemas/attendance.schema.js';

export const createAttendance = async (req, res) => {
  const parsed = createAttendanceSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { studentId, courseId, date, status } = parsed.data;

  try {
    const attendance = await prisma.attendance.create({
      data: { studentId, courseId, date: new Date(date), status },
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create attendance' });
  }
};

export const updateAttendance = async (req, res) => {
  const paramsParsed = attendanceIdParamsSchema.safeParse(req.params);
  const bodyParsed = updateAttendanceSchema.safeParse(req.body);

  if (!paramsParsed.success || !bodyParsed.success) {
    return res.status(400).json({ error: 'Validation failed' });
  }

  const id = parseInt(paramsParsed.data.id, 10);
  const data = bodyParsed.data;

  try {
    const existing = await prisma.attendance.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Attendance not found' });
    }

    const updated = await prisma.attendance.update({
      where: { id },
      data,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update attendance' });
  }
};

export const getAttendances = async (req, res) => {
  const parsed = attendanceQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const filters = {};
  if (parsed.data.courseId) filters.courseId = parseInt(parsed.data.courseId);
  if (parsed.data.studentId)
    filters.studentId = parseInt(parsed.data.studentId);

  try {
    const attendances = await prisma.attendance.findMany({
      where: filters,
      include: {
        student: { select: { id: true, email: true } },
        course: { select: { id: true, name: true } },
      },
    });

    res.json(attendances);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance records' });
  }
};
