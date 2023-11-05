const { Schema, model } = require("mongoose");

const categories = [
  "salads",
  "bowls",
  "soups",
  "pizzas",
  "burgers",
  "desserts",
];

const foodsShema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imgUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: categories,
      ref: "Category",
      required: true,
    },
    seasonal: {
      type: Boolean,
      default: false,
      required: true,
    },
    popular: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const FoodModel = model("foods", foodsShema);

module.exports = {
  FoodModel,
};
