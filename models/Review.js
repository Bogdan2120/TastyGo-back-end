const { Schema, model } = require("mongoose");

const reviewShema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    comenth: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      max: 5,
      default: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    name: {
      type: String,
      required: true,
    },
    avatarURL: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { versionKey: false, timestamps: true }
);

const ReviewModel = model("review", reviewShema);

module.exports = {
  ReviewModel,
};
