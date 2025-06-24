import { prisma } from '../db/prismaClient.js';
import {
  createScheduleSchema,
  updateScheduleSchema,
  scheduleIdParamSchema,
  scheduleStudentIdParamSchema,
} from '../schemas/schedule.schema.js';

export const createSchedule = async (req, res) => {
  const parsed = createScheduleSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const schedule = await prisma.schedule.create({ data: parsed.data });
    res.status(201).json(schedule);
  } catch {
    res.status(500).json({ error: 'Failed to create schedule' });
  }
};

export const updateSchedule = async (req, res) => {
  const idParsed = scheduleIdParamSchema.safeParse(req.params);
  const bodyParsed = updateScheduleSchema.safeParse(req.body);
  if (!idParsed.success || !bodyParsed.success) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const updated = await prisma.schedule.update({
      where: { id: parseInt(idParsed.data.id) },
      data: bodyParsed.data,
    });
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to update schedule' });
  }
};

export const deleteSchedule = async (req, res) => {
  const parsed = scheduleIdParamSchema.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  try {
    await prisma.schedule.delete({ where: { id: parseInt(parsed.data.id) } });
    res.status(204).json({ message: 'Subject deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete schedule' });
  }
};

export const getAllSchedules = async (req, res) => {
  try {
    const schedules = await prisma.schedule.findMany({
      include: { course: true },
    });
    res.json(schedules);
  } catch {
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
};

export const getStudentSchedule = async (req, res) => {
  const parsed = scheduleStudentIdParamSchema.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  try {
    const schedules = await prisma.schedule.findMany({
      where: {
        course: {
          studentCourses: {
            some: { studentId: parseInt(parsed.data.studentId) },
          },
        },
      },
      include: {
        course: {
          select: { id: true, name: true },
        },
      },
    });
    res.json(schedules);
  } catch (error) {
    console.log({ error });

    res.status(500).json({ error: 'Failed to fetch student schedule' });
  }
};
