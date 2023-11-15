const router = require("express").Router();
const {
  getAllFoods,
  getFoodsById,
  getFoodsSeasonal,
  getSearchFoods,
  getFoodByCategory,
} = require("../controllers/foods");

// Foods
router.get("/", getAllFoods);
router.get("/seasonal", getFoodsSeasonal);
router.get("/search", getSearchFoods);
router.get("/category/:category", getFoodByCategory);
router.get("/:foodId", getFoodsById);

module.exports = router;
