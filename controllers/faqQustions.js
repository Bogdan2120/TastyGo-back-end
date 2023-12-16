const { HttpError, ctrlWrapper } = require("../hellpers");
const { FaqQuestionModel } = require("../models/FaqQuestions");

const addNewQuestions = async (req, res) => {
  const result = await FaqQuestionModel.create({
    ...req.body,
  });

  res.status(201).json(result);
};

module.exports = {
  addNewQuestions: ctrlWrapper(addNewQuestions),
};
