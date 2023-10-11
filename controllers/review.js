const { HttpError, ctrlWrapper } = require("../hellpers");
const { ReviewModel } = require("../models/Review");
const { UserModal } = require("../models/User");

const getAllReview = async (req, res) => {
  const reviews = await ReviewModel.find();
  if (!reviews) {
    throw HttpError(404, `Reviews not found`);
  }
  res.json(reviews);
};

const addNewReview = async (req, res) => {
  const { id: userId } = req.userId;

  const { email } = await UserModal.findById(userId);

  const result = await ReviewModel.create({ ...req.body, email, owner: userId });
  res.status(201).json(result);
};

module.exports = {
  getAllReview: ctrlWrapper(getAllReview),
  addNewReview: ctrlWrapper(addNewReview),
};
