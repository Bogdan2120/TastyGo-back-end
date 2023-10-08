const router = require("express").Router();
const {
  getAllCategory,
  getSortPopularCategory,
  getItemsCategoryAndUpdateView,
} = require("../controllers/category");

// Categories
router.get("/", getAllCategory);
router.get("/popular", getSortPopularCategory);
router.get("/:categoryName", getItemsCategoryAndUpdateView);

module.exports = router;
