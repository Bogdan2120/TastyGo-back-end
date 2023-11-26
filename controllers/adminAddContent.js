const { HttpError, ctrlWrapper } = require("../hellpers");
const { FoodModel } = require("../models/Food");
const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const path = require("path");

const cloudinary = require("cloudinary").v2;

const { SECRET_KEY, CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET } = process.env;

cloudinary.config({
  cloud_name: `${CLOUD_NAME}`,
  api_key: `${CLOUD_API_KEY}`,
  api_secret: `${CLOUD_API_SECRET}`,
});

// const updateContentDishesImages = async (req, res) => {
//   // const { foodId } = req.params;
//   //   const food = await FoodModel.findById(foodId);
//   const foods = await FoodModel.find({}, "");

//   foods.map(async (food) => {
//     // console.log(food);
//     //  const { path: tempUpload } = req.file;
//     // const { id } = food._id;
//     // console.log("id", id);
//     const parts = food.imgUrl.split("/");
//     const imageName = parts[parts.length - 1].split(".")[0];
//     const options = {
//       public_id: imageName.secure_url,
//       folder: "TastyGo_Project/content/dishes_png_test",
//       overwrite: true,
//       transformation: [
//         {
//           width: 300,
//           height: 300,
//           crop: "fill",
//           gravity: "auto",
//         },
//       ],
//     };

//     const dishesImgURL = await cloudinary.uploader.upload(food.imgUrl, options);
//     // console.log(food._id);
//     await FoodModel.findByIdAndUpdate(
//       food._id,
//       {
//         ...food,
//         imgUrl: dishesImgURL.secure_url,
//       },
//       console.log("clou", dishesImgURL.secure_url),
//       console.log("food", food.imgUrl)
//     );
//   });

//   res.json("ok");
// };

const updateContentDishesImages = async (req, res) => {
  const foods = await FoodModel.find({}, "");

  for (const food of foods) {
    const parts = food.imgUrl.split("/");
    const imageName = parts[parts.length - 1].split(".")[0];

    const options = {
      public_id: imageName,
      folder: "TastyGo_Project/content/dishes_png_test",
      overwrite: true,
      transformation: [
        {
          width: 300,
          height: 300,
          crop: "fill",
          gravity: "auto",
        },
      ],
    };

    try {
      const dishesImgURL = await cloudinary.uploader.upload(
        food.imgUrl,
        options
      );
      await FoodModel.findByIdAndUpdate(food._id, {
        imgUrl: dishesImgURL.secure_url,
      });
    } catch (error) {
      console.error(error);
    }
  }

  res.json("ok");
};

module.exports = {
  updateDishesImages: ctrlWrapper(updateContentDishesImages),
};
