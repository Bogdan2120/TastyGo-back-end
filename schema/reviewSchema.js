const Joi = require("joi");

const reviewSchema = Joi.object({
  title: Joi.string().required(),
  text: Joi.string().required(),
  rating: Joi.number().max(5).required(),
});

module.exports = {
  reviewSchema,
};
