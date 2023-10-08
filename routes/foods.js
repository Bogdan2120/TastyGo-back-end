const router = require("express").Router();
const {
  getAllFoods,
  getFoodsById,
  getFoodsSeasonal,
} = require("../controllers/foods");

// Foods
router.get("/", getAllFoods);
router.get("/seasonal", getFoodsSeasonal);
router.get("/:foodId", getFoodsById);

module.exports = router;
