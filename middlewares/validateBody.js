const { HttpError } = require("../hellpers");

const validateBody = (schema) => {
  const func = async (req, res, next) => {
    try {
      const { error } = schema.validate(req.body);

      if (error) {
        let errorName = "";
        error.details.map((item) => (errorName = item.message));

        throw HttpError(400, errorName);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
  return func;
};

module.exports = validateBody;
