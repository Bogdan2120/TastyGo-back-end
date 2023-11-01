const router = require("express").Router();
const {
  getAllFoods,
  getFoodsById,
  getFoodsSeasonal,
  getSortPopularFoods,
  getSearchFoods,
} = require("../controllers/foods");

// Foods
router.get("/", getAllFoods);
router.get("/seasonal", getFoodsSeasonal);
router.get("/popular", getSortPopularFoods);
router.get("/search", getSearchFoods);
router.get("/:foodId", getFoodsById);

module.exports = router;
