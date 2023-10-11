const router = require("express").Router();
const checkAuth = require("../middlewares/checkAuth");
const validateBody = require("../middlewares/validateBody");
const { addNewReview, getAllReview } = require("../controllers/review");
const { reviewSchema } = require("../schema/reviewSchema");

// Review
router.get("/", getAllReview);
router.post("/new-review", checkAuth, validateBody(reviewSchema), addNewReview);

module.exports = router;
