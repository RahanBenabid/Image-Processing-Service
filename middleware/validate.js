import { validationResult } from "express-validator";
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let error = {};
    errors.array().forEach((err) => (error[err.param] = err.msg));
    return res.status(422).json({ error });
  }
  next();
};

export { validate };
