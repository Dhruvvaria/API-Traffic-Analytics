const Joi = require("joi");

const visitSchema = Joi.object({
  url: Joi.string().uri().required(),
  referrer: Joi.string().uri().allow("").optional(),
  sessionId: Joi.string().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
});

module.exports = (req, res, next) => {
  const { error } = visitSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};
