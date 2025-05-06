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
    
    rotate: Joi.number().integer(), 
    
    format: Joi.string()
    .valid("jpeg", "png", "gif", "bmp", "webp")
    .insensitive()
    .optional(),
    
    compress: Joi.alternatives().try(
      Joi.boolean().optional(),
      Joi.object({
        quality: Joi.number().integer().min(1).max(100).default(85)
      }).optional()
    ),
    
    filters: Joi.object({
      blackAndWhite: Joi.boolean().default(false),
        thumbnail: Joi.alternatives().try(
          Joi.boolean().default(false),
            Joi.object({
              width: Joi.number().integer().min(1).max(1000).default(128),
                height: Joi.number().integer().min(1).max(1000).default(128)
            })
            ),
            sharpen: Joi.alternatives().try(
              Joi.boolean().default(false),
                Joi.number().min(0).max(10).default(4)
                  ),
                  blur: Joi.alternatives().try(
                    Joi.boolean().default(false),
                      Joi.number().min(0.3).max(100).default(2)
                        ),
                        brightness: Joi.number().min(0).max(5).optional(),
                        contrast: Joi.number().min(0).max(5).optional(),
                        sepia: Joi.boolean().default(false),
                          invert: Joi.boolean().default(false)
                          }).optional(),
                  
                  flip: Joi.string()
                  .valid("horizontal", "vertical", "both")
                  .insensitive()
                  .optional(),
                  
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
    
    if (error) {
      return res.status(400).json({
        error: "Invalid transformation request",
        details: error.details.map(err => {
          message: err.message,
          path: err.path,
        })
      })
    }
    
    req.validatedTransformation = value;
    next();
  } catch (err) {
    return res.status(500).json({
      error: "JSON validation failed",
      message: err.message
    });
  }
};

export { jsonValidation };
