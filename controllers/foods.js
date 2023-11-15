const { HttpError, ctrlWrapper } = require("../hellpers");
const { FoodModel } = require("../models/Food");
const pagination = require("../utils/pagination");

const getAllFoods = async (req, res) => {
  const { page: currentPage, limit: currentLimit } = req.query;
  const { page, limit, skip } = pagination(currentPage, currentLimit);

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

const getFoodByCategory = async (req, res) => {
  const { category } = req.params;
  const { page: currentPage, limit: currentLimit } = req.query;
  const { page, limit, skip } = pagination(currentPage, currentLimit);

  const foods = await FoodModel.find({ category }, "", {
    skip,
    limit,
  });
  const count = await FoodModel.find({ category }).count();

  if (!foods) {
    throw HttpError(404, `Food with category "${category}" not found`);
  }
  res.json({
    foods,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    totalFoods: count,
  });
};

const getFoodsSeasonal = async (req, res) => {
  const seasonalFoods = await FoodModel.find({ seasonal: true }).limit(10);
  if (!seasonalFoods) {
    throw HttpError(404, `Food with category not found`);
  }

  res.json(seasonalFoods);
};

const getSortPopularFoods = async (req, res) => {
  const { page: currentPage, limit: currentLimit } = req.query;
  const { page, limit, skip } = pagination(currentPage, currentLimit);

  const popularFoods = await FoodModel.find({}, "", {
    skip,
    limit,
  }).sort("-popular");

  const count = await FoodModel.find().count();

  if (!popularFoods) {
    throw HttpError(404, `Food with category not found`);
  }

  res.json({
    popularFoods,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    totalFoods: count,
  });
};

const getSearchFoods = async (req, res) => {
  const { page: currentPage, limit: currentLimit, search } = req.query;
  const { page, limit, skip } = pagination(currentPage, currentLimit);

  const searchFoods = await FoodModel.find({}, "", {
    skip,
    limit,
  });

  if (!searchFoods) {
    throw HttpError(404, `Search not found`);
  }

  const newSearch = search.replace(/\+/gi, " ");
  const lowerCaseSearch = newSearch.toLowerCase();

  const filterFood = searchFoods.filter(({ title }) => {
    const lowerCaseTitle = title.toLowerCase();
    return lowerCaseTitle.includes(lowerCaseSearch);
  });

  if (!filterFood) {
    throw HttpError(404, `Search not found`);
  }

  res.json({
    filterFood,
    totalPages: Math.ceil(filterFood.length / limit),
    currentPage: page,
    totalSearchFoods: filterFood.length,
  });
};

module.exports = {
  getAllFoods: ctrlWrapper(getAllFoods),
  getFoodsById: ctrlWrapper(getFoodsById),
  getFoodsSeasonal: ctrlWrapper(getFoodsSeasonal),
  getSearchFoods: ctrlWrapper(getSearchFoods),
  getFoodByCategory: ctrlWrapper(getFoodByCategory),
};
