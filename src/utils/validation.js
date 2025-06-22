// subject
export function validateSubjectPayload(req, res, next) {
  const { name } = req.body;
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Invalid subject name' });
  }
  next();
}

export function validateIdParam(req, res, next) {
  const { id } = req.params;
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId) || parsedId <= 0) {
    return res.status(400).json({ error: 'Invalid subject ID' });
  }
  next();
}

// auth
export function validatePassword(password) {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return passwordRegex.test(password);
}

export function validateUpdateUser(req, res, next) {
  const { email, role, newPassword } = req.body;

  if (email !== undefined) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
  }

  if (role !== undefined) {
    if (!Object.values(USER_ROLES).includes(role)) {
      return res.status(400).json({ error: 'Invalid role value' });
    }
  }

  if (newPassword !== undefined) {
    if (!validatePassword(newPassword)) {
      return res.status(400).json({
        error:
          'Password must be at least 8 characters long, contain one uppercase letter and one digit',
      });
    }
  }

  next();
}
