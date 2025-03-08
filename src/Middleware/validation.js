
export const Validate = (schema) => (req, res, next) => {
  const schemaKeys = Object.keys(schema);
  for (const key of schemaKeys) {
    const { error } = schema[key].validate(req[key]);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
  }
  next();
};