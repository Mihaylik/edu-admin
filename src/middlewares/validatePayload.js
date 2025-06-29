export const validateBody = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'Validation failed', details: err.errors });
  }
};

export const validateParams = (schema) => (req, res, next) => {
  try {
    req.params = schema.parse(req.params);
    next();
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'Validation failed', details: err.errors });
  }
};
