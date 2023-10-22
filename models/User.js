const { Schema, model } = require("mongoose");
const Joi = require("joi");

const phoneRegexp = /^\+380\d{9}$/;

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
    avatarURL: {
      type: String,
      required: true,
    },
    avatarNAME: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    phone: {
      match: phoneRegexp,
      type: String,
      required: [true, "Phone number is required"],
    },
    address: {
      type: String,
      default: "",
    },
    birth: {
      type: String,
      default: "",
    },
    subscribtion: {
      type: Boolean,
      default: false,
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
