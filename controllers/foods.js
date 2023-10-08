const { HttpError, ctrlWrapper } = require("../hellpers");
const { FoodModel } = require("../models/Food");

const getAllFoods = async (req, res) => {
  const { page = 1, limit = 12 } = req.query;
  const skip = (page - 1) * limit;

  const foods = await FoodModel.find({}, "", {
    skip,
    limit,
  });

  const count = await FoodModel.countDocuments();

  if (!foods) {
    throw HttpError(404, `Foods with not found`);
  }

  res.json({
    foods,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    totalFoods: count,
  });
};

const getFoodsById = async (req, res) => {
  const { foodId } = req.params;
  const food = await FoodModel.findById(foodId);
  if (!food) {
    throw HttpError(404, `Food with id "${foodId}" not found`);
  }

  res.json(food);
};

const getFoodsSeasonal = async (req, res) => {
  const seasonalFoods = await FoodModel.find({ seasonal: true }).limit(10);
  if (!seasonalFoods) {
    throw HttpError(404, `Food with category "${seasonal}" not found`);
  }

  res.json(seasonalFoods);
};

module.exports = {
  getAllFoods: ctrlWrapper(getAllFoods),
  getFoodsById: ctrlWrapper(getFoodsById),
  getFoodsSeasonal: ctrlWrapper(getFoodsSeasonal),
};
