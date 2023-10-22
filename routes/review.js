const router = require("express").Router();
const checkAuth = require("../middlewares/checkAuth");
const validateBody = require("../middlewares/validateBody");
const {
  addNewReview,
  getAllReview,
  updateReviewById,
  deleteReviewById,
} = require("../controllers/review");
const { reviewSchema } = require("../schema/reviewSchema");

// Review
router.get("/", getAllReview);
router.post("/new-review", checkAuth, validateBody(reviewSchema), addNewReview);
router.patch(
  "/updata/:reviewId",
  checkAuth,
  validateBody(reviewSchema),
  updateReviewById
);
router.delete("/delete/:reviewId", checkAuth, deleteReviewById);

module.exports = router;
