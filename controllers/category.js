const { HttpError, ctrlWrapper } = require("../hellpers");
const { CategoryModel } = require("../models/Category");
const { FoodModel } = require("../models/Food");

const getAllCategory = async (req, res) => {
  const category = await CategoryModel.find();
  if (!category) {
    throw HttpError(404, `Category not found`);
  }

  res.json(category);
};

const getSortPopularCategory = async (req, res) => {
  const popularCategory = await CategoryModel.find().sort("-views").limit(6);

  if (!popularCategory) {
    throw HttpError(404, `Popular category not found`);
  }
  res.json(popularCategory);
};

const getItemsCategoryAndUpdateView = async (req, res) => {
  const { categoryName } = req.params;
  const { page = 1, limit = 12 } = req.query;
  const skip = (page - 1) * limit;

  const foodForCategory = await FoodModel.find({ category: categoryName }, "", {
    skip,
    limit,
  });

  const count = await FoodModel.countDocuments({ category: categoryName });

  if (!foodForCategory) {
    throw HttpError(404, `Category with ${categoryName} not found`);
  }

  const resultUpdate = await CategoryModel.findOneAndUpdate(
    { title: categoryName },
    {
      $inc: { views: 1 },
    }
  );

  if (!resultUpdate) {
    throw HttpError(404, `Category with ${categoryName} doesn\'t update views`);
  }

  res.json({
    foodForCategory,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    totalFoods: count,
  });
};

module.exports = {
  getAllCategory: ctrlWrapper(getAllCategory),
  getSortPopularCategory: ctrlWrapper(getSortPopularCategory),
  getItemsCategoryAndUpdateView: ctrlWrapper(getItemsCategoryAndUpdateView),
};
