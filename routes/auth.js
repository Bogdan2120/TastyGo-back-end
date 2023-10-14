const router = require("express").Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  updateAvatar,
} = require("../controllers/auth");
const checkAuth = require("../middlewares/checkAuth");
const validateBody = require("../middlewares/validateBody");
const upload = require("../middlewares/upload");
const { userSchema } = require("../schema/schema");

//Register
router.post("/register", validateBody(userSchema), registerUser);

//Login
router.post("/login", validateBody(userSchema), loginUser);

//Logout
router.post("/logout", checkAuth, logoutUser);

//Current user
router.get("/current-user", checkAuth, currentUser);

//Upload avatar
router.patch("/avatars", checkAuth, upload.single("avatar"), updateAvatar);

module.exports = router;
