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
  const { email, password, firstName, phoneFirst, subscribtion } = req.body;

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
  const avatarDef = await cloudinary.uploader.upload(avatarDefPath, options);

  const newUser = await UserModal.create({
    user: {
      email,
      password: hashPassword,
      avatarURL: avatarDef.secure_url,
      avatarNAME: sanitizedHash,
      firstName: firstName,
      phoneFirst: phoneFirst,
      subscribtion: subscribtion,
    },
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

  const userData = await UserModal.findOne({ "user.email": email });
  if (!email) {
    throw HttpError(401, "Not authorized");
  }

  const hashPassword = await bcrypt.compare(password, userData.user.password);

  if (!hashPassword) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: userData.id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });

  const updateUser = await UserModal.findByIdAndUpdate(
    userData._id,
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

const updateUser = async (req, res) => {
  const { id } = req.userId;
  const { body } = req;
  // const user = await UserModal.findByIdAndUpdate(id, { body }, { new: true });
  // console.log(user);
  // if (!user) {
  //   throw HttpError(404, "User not found");
  // }
  // res.json(user);
  try {
    const user = await UserModal.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = { user: { ...user.user, ...body } };
    // console.log(updatedUser);
    const result = await UserModal.findByIdAndUpdate(id, updatedUser, {
      new: true,
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error updating user" });
  }
};

const updateAvatar = async (req, res) => {
  const { id } = req.userId;
  const { user } = await UserModal.findById(id);
  const { path: tempUpload, filename } = req.file;
  const avatarName = `${id}_${filename}`;
  const resultUpload = path.join(avatarDir, avatarName);
  const options = {
    public_id: user.avatarNAME,
    folder: "TastyGo_Project/users_avatars",
    overwrite: true,
  };

  const optimizeAvatar = await Jimp.read(tempUpload);
  optimizeAvatar.cover(250, 250).quality(60).write(resultUpload);
  // await fs.rename(tempUpload, resultUpload);
  await fs.unlink(tempUpload);

  const avatarURL = await cloudinary.uploader.upload(resultUpload, options);
  await UserModal.findByIdAndUpdate(id, {
    user: { ...user, avatarURL: avatarURL.secure_url },
  });
  res.json(avatarURL.secure_url);
  await fs.unlink(resultUpload);
};

const deleteAvatar = async (req, res) => {
  const { id } = req.userId;
  const { user } = await UserModal.findById(id);

  const hashEmail = await bcrypt.hash(user.email, 10);
  const sanitizedHash = hashEmail.replace(/\//g, "");
  const options = {
    public_id: `${sanitizedHash}`,
    folder: "TastyGo_Project/users_avatars",
    overwrite: true,
  };
  const avatarDef = await cloudinary.uploader.upload(avatarDefPath, options);
  await UserModal.findByIdAndUpdate(id, {
    user: { ...user, avatarURL: avatarDef.secure_url },
  });
  res.json(avatarDef.secure_url);
};

module.exports = {
  registerUser: ctrlWrapper(registerUser),
  loginUser: ctrlWrapper(loginUser),
  logoutUser: ctrlWrapper(logoutUser),
  currentUser: ctrlWrapper(currentUser),
  updateUser: ctrlWrapper(updateUser),
  updateAvatar: ctrlWrapper(updateAvatar),
  deleteAvatar: ctrlWrapper(deleteAvatar),
};
