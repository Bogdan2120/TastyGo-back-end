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

  const { user } = await UserModal.findById(userId);

  const result = await ReviewModel.create({
    ...req.body,
    name: user.firstName,
    avatarURL: user.avatarURL,
    owner: userId,
  });
  res.status(201).json(result);
};

const updateReviewById = async (req, res) => {
  const { reviewId } = req.params;
  const result = await ReviewModel.findByIdAndUpdate(reviewId, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, `Review with ${reviewId} not found`);
  }
  res.json(result);
};

const deleteReviewById = async (req, res) => {
  const { reviewId } = req.params;
  const result = await ReviewModel.findByIdAndDelete(reviewId);
  if (!result) {
    throw HttpError(404, `Review with ${contactId} not found`);
  }
  res.json({
    massege: "Review deleted",
  });
};

module.exports = {
  getAllReview: ctrlWrapper(getAllReview),
  addNewReview: ctrlWrapper(addNewReview),
  updateReviewById: ctrlWrapper(updateReviewById),
  deleteReviewById: ctrlWrapper(deleteReviewById),
};
