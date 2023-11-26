const Joi = require("joi");

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
  firstName: Joi.string().max(24).required(),
  phoneFirst: Joi.string().length(12).required(),
  subscribtion: Joi.boolean(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
});

module.exports = {
  registerSchema,
  loginSchema,
};
