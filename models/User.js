const { Schema, model } = require("mongoose");
const Joi = require("joi");

const authSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    token: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

const UserModal = model("user", authSchema);

module.exports = {
  UserModal,
};
