const router = require("express").Router();
const { updateDishesImages } = require("../controllers/adminAddContent");
// const checkAuth = require("../middlewares/checkAuth");
// const validateBody = require("../middlewares/validateBody");
const upload = require("../middlewares/upload");
// const { registerSchema, loginSchema } = require("../schema/schema");

//Reuploud dishes images
router.patch(
  "/adminReuploudDishesImages",
  //   checkAuth,
  //   upload.single("dishesImages"),
  updateDishesImages
);

module.exports = router;
