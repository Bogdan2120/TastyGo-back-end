const { HttpError, ctrlWrapper } = require("../hellpers");
const { FoodModel } = require("../models/Food");
const pagination = require("../utils/pagination");

const getAllFoods = async (req, res) => {
  const { page: currentPage, limit: currentLimit } = req.query;
  const {page, limit, skip} = pagination(currentPage, currentLimit);

  const foods = await FoodModel.find({}, "", {
    skip,
    limit,
  });

  const count = await FoodModel.find().count();

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
