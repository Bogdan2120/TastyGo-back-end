const router = require("express").Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  updateUser,
  updateAvatar,
  deleteAvatar,
} = require("../controllers/auth");
const checkAuth = require("../middlewares/checkAuth");
const validateBody = require("../middlewares/validateBody");
const upload = require("../middlewares/upload");
const { registerSchema, loginSchema } = require("../schema/schema");

//Register
router.post("/register", validateBody(registerSchema), registerUser);

//Login
router.post("/login", validateBody(loginSchema), loginUser);

//Logout
router.post("/logout", checkAuth, logoutUser);

//Current user
router.get("/current-user", checkAuth, currentUser);

//Update user data
router.patch("/update-user", checkAuth, updateUser);

//Upload avatar
router.patch("/avatars", checkAuth, upload.single("avatar"), updateAvatar);

//Delete avatar
router.delete("/delete-avatar", checkAuth, deleteAvatar);

module.exports = router;
