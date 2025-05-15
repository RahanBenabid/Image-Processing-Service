import Joi from "joi";

const transformationValidation = (req, res, next) => {
  const schema = Joi.object({
    resize: Joi.object({
      width: Joi.number().integer().min(1),
      height: Joi.number().integer().min(1),
    }).optional(),

    crop: Joi.object({
      width: Joi.number().integer().min(1),
      height: Joi.number().integer().min(1),
      x: Joi.number().integer().min(0),
      y: Joi.number().integer().min(0),
    }).optional(),

    rotate: Joi.object({
      degrees: Joi.number().integer(),
    }).optional(),

    format: Joi.string()
      .valid("jpeg", "png", "gif", "bmp", "webp")
      .insensitive()
      .optional(),

    compress: Joi.alternatives().try(
      Joi.object({
        percentage: Joi.number().integer().min(1).max(100).default(80),
      }),
    ).optional(),

    filters: Joi.object({
      thumbnail: Joi.alternatives().try(
        Joi.boolean().default(false),
        Joi.object({
          width: Joi.number().integer().min(1).max(1000).default(128),
          height: Joi.number().integer().min(1).max(1000).default(128),
        }),
      ),
      sharpen: Joi.alternatives().try(
        Joi.boolean().default(false),
        Joi.number().min(0).max(10).default(4),
      ),
      blur: Joi.alternatives().try(
        Joi.boolean().default(false),
        Joi.number().min(0.3).max(100).default(2),
      ),
      brightness: Joi.alternatives().try(
        Joi.boolean().default(false),
        Joi.number().min(0).max(5).default(4),
      ),
      contrast: Joi.alternatives().try(
        Joi.boolean().default(false),
        Joi.number().min(0).max(5).default(4),
      ),
          //contrast: Joi.number().min(0).max(5).optional(),
      blackAndWhite: Joi.boolean().default(false),
      sepia: Joi.boolean().default(false),
      invert: Joi.boolean().default(false),
    }).optional(),

    flip: Joi.object({
      direction: Joi.string()
      .valid("horizontal", "vertical", "both")
      .insensitive()
    }).optional(),

    // for backward compatibility
    transpose: Joi.string()
      .valid("horizontal", "vertical", "both")
      .insensitive()
      .optional(),
  });

  try {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // abort all error, not just the first one
      stripUnknown: true, // remove known keys
    });

    if (err) {
      return res.status(400).json({
        error: "Invalid transformation request",
        err,
      });
    }

    req.validatedTransformation = value;
    next();
  } catch (err) {
    return res.status(500).json({
      error: "JSON validation failed",
      message: err,
    });
  }
};

export { transformationValidation };
