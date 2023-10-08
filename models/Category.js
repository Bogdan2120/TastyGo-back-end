const { Schema, model } = require("mongoose");

const categoryShema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const CategoryModel = model("category", categoryShema);

module.exports = {
  CategoryModel,
};
