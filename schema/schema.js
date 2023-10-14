const Joi = require("joi");

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
  name: Joi.string().max(24).required(),
  phone: Joi.string().length(13).required(),
  subscribtion: Joi.boolean(),
});

module.exports = {
  userSchema,
};
