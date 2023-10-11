const { HttpError, ctrlWrapper } = require("../hellpers");
const { UserModal } = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");
const Jimp = require("jimp");
const crypto = require("crypto");
const request = require("request");

const { SECRET_KEY } = process.env;

const avatarDir = path.join(__dirname, "../", "public", "avatars");

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModal.findOne({ email });
  if (user) {
    throw HttpError(409, "User already exist");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await UserModal.create({
    email,
    password: hashPassword,
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

const uploadAvatarToGravatar = (email, avatarPath) => {
  const emailHash = crypto
    .createHash("md5")
    .update(email.toLowerCase())
    .digest("hex");
  const gravatarURL = `https://www.gravatar.com/avatar/${emailHash}`;

  const formData = {
    image: {
      value: require("fs").createReadStream(avatarPath),
      options: {
        filename: "avatar.jpg",
        contentType: "image/jpeg",
        uri: gravatarURL,
      },
    },
  };

  return new Promise((resolve, reject) => {
    request.post({ url: gravatarURL, formData }, (err, res, body) => {
      if (err) {
        reject(err);
      } else {
        resolve(gravatarURL);
        console.log(formData.image.options.uri);
      }
    });
  });
};

const updateAvatar = async (req, res) => {
  console.log(req.user);
  const { _id } = req.user;
  const { path: tempUpload, filename } = req.file;

  const avatarName = `${_id}_${filename}`;
  const resultUpload = path.join(avatarDir, avatarName);

  const optimizeAvatar = await Jimp.read(tempUpload);
  optimizeAvatar
    .cover(250, 250) // resize
    .quality(60) // set JPEG quality
    .write(resultUpload); // save
  // await fs.rename(tempUpload, resultUpload);
  await fs.unlink(tempUpload);

  const avatarURL = path.join("avatars", avatarName);
  await UserModal.findByIdAndUpdate(_id, { avatarURL });
  try {
    await uploadAvatarToGravatar(req.user.email, resultUpload);

    res.json({ avatarURL });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload avatar to Gravatar" });
  }
};

module.exports = {
  registerUser: ctrlWrapper(registerUser),
  loginUser: ctrlWrapper(loginUser),
  logoutUser: ctrlWrapper(logoutUser),
  currentUser: ctrlWrapper(currentUser),
  updateAvatar: ctrlWrapper(updateAvatar),
};
