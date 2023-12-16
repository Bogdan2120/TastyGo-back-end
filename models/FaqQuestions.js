const { Schema, model } = require("mongoose");

const faqQuestionShema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is requred!"],
    },
    email: {
      type: String,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
            v
          );
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
      required: [true, "Email is requred!"],
    },
    message: {
      type: String,
      required: [true, "Message is requred!"],
    },
  },
  { versionKey: false, timestamps: true }
);

const FaqQuestionModel = model("faq_question", faqQuestionShema);

module.exports = {
  FaqQuestionModel,
};
