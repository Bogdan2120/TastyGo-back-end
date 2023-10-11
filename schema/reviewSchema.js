const Joi = require("joi");

const reviewSchema = Joi.object({
  title: Joi.string().required(),
  comenth: Joi.string().required(),
  rating: Joi.number().max(5).required(),
});

module.exports = {
  reviewSchema,
};
