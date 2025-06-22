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