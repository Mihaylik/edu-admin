import { prisma } from '../db/prismaClient.js';
import { USER_ROLES } from '../utils/roles.js';

export async function authorizeAdminOrTeacherForSubject(req, res, next) {
  const { role, userId } = req.user;
  const subjectId = parseInt(req.params.id, 10);

  if (role === USER_ROLES.admin) return next();

  if (role === USER_ROLES.teacher) {
    const subjectWithCourses = await prisma.subject.findUnique({
      where: { id: subjectId },
      include: {
        courses: {
          where: {
            teacherId: userId,
          },
        },
      },
    });

    if (!subjectWithCourses || subjectWithCourses.courses.length === 0) {
      return res.status(403).json({ error: 'Access denied: Not your subject' });
    }

    return next();
  }

  return res.status(403).json({ error: 'Access denied' });
}

export async function authorizeAdminOrCourseTeacher(req, res, next) {
  const { role, userId } = req.user;
  const courseId = parseInt(req.params.id, 10);

  if (role === USER_ROLES.admin) return next();

  if (role === USER_ROLES.teacher) {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { teacherId: true },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.teacherId === userId) return next();
  }

  return res.status(403).json({ error: 'Access denied: Not your course' });
}
