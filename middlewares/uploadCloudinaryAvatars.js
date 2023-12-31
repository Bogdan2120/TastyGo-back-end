const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "TastyGo_Project/users_avatars",
    format: async (req, file) => {},
    overwrite: true,
  },
  allowedFormats: ["jpg", "png", "webp"],
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadCloudAvatars = multer({ storage });

module.exports = uploadCloudAvatars;
