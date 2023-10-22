const { HttpError, ctrlWrapper } = require("../hellpers");
const { UserModal } = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const fs = require("fs/promises");
const path = require("path");
const Jimp = require("jimp");
const { options } = require("joi");
const cloudinary = require("cloudinary").v2;

const { SECRET_KEY, CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET } = process.env;

cloudinary.config({
  cloud_name: `${CLOUD_NAME}`,
  api_key: `${CLOUD_API_KEY}`,
  api_secret: `${CLOUD_API_SECRET}`,
});

const avatarDefPath = path.join(
  __dirname,
  "../",
  "public",
  "avatar",
  "DefaultAvatar.png"
);

const avatarDir = path.join(__dirname, "../", "temp");

const registerUser = async (req, res) => {
  const { email, password, name, phone, subscribtion } = req.body;

  const user = await UserModal.findOne({ email });
  if (user) {
    throw HttpError(409, "User already exist");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const hashEmail = await bcrypt.hash(email, 10);
  const sanitizedHash = hashEmail.replace(/\//g, "");
  const options = {
    public_id: `${sanitizedHash}`,
    folder: "TastyGo_Project/users_avatars",
    overwrite: true,
  };
  const avatarDef = await cloudinary.uploader.upload(
    avatarDefPath,
    options
    // { folder: "home" },
    // {
    //   public_id: `default_${hashEmail}`,
    // }
  );

  const newUser = await UserModal.create({
    email,
    password: hashPassword,
    avatarURL: avatarDef.secure_url,
    avatarNAME: sanitizedHash,
    name: name,
    phone: phone,
    subscribtion: subscribtion,
  });

  const payload = {
    id: newUser._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });

  const createUser = await UserModal.findByIdAndUpdate(
    newUser._id,
    { token },
    { new: true }
  );

  res.status(201).json(createUser);
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModal.findOne({ email });
  if (!email) {
    throw HttpError(401, "Not authorized");
  }
  const hashPassword = await bcrypt.compare(password, user.password);

  if (!hashPassword) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user.id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });

  const updateUser = await UserModal.findByIdAndUpdate(
    user._id,
    { token },
    { new: true }
  );

  res.json(updateUser);
};

const logoutUser = async (req, res) => {
  const { id } = req.userId;
  await UserModal.findByIdAndUpdate(id, { token: "" });

  res.json({
    message: "Succes logout",
  });
};

const currentUser = async (req, res) => {
  const { id } = req.userId;
  const user = await UserModal.findById(id);
  if (!user) {
    throw HttpError(404, "User not found");
  }

  res.json(user);
};

const updateAvatar = async (req, res) => {
  const { id } = req.userId;
  const user = await UserModal.findById(id);
  const { path: tempUpload, filename } = req.file;
  const avatarName = `${id}_${filename}`;
  const resultUpload = path.join(avatarDir, avatarName);
  const options = {
    public_id: user.avatarNAME,
    folder: "TastyGo_Project/users_avatars",
    overwrite: true,
  };

  const optimizeAvatar = await Jimp.read(tempUpload);
  optimizeAvatar
    .cover(250, 250) // resize
    .quality(60) // set JPEG quality
    .write(resultUpload); // save
  // await fs.rename(tempUpload, resultUpload);
  await fs.unlink(tempUpload);

  const avatarURL = await cloudinary.uploader.upload(resultUpload, options);
  await UserModal.findByIdAndUpdate(id, { avatarURL: avatarURL.secure_url });
  res.json(avatarURL.secure_url);

  // try {
  //   const result = await cloudinary.uploader.upload(resultUpload, {
  //     public_id: id,
  //   });
  //   res.json(result.secure_url);
  // } catch (err) {
  //   console.error(err);
  //   res.status(500).json({ error: "Failed to upload avatar to Cloudinary" });
  // }
  await fs.unlink(resultUpload);
};

module.exports = {
  registerUser: ctrlWrapper(registerUser),
  loginUser: ctrlWrapper(loginUser),
  logoutUser: ctrlWrapper(logoutUser),
  currentUser: ctrlWrapper(currentUser),
  updateAvatar: ctrlWrapper(updateAvatar),
};
