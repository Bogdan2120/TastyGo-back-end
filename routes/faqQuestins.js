const router = require("express").Router();
const validateBody = require("../middlewares/validateBody");
const { addNewQuestions } = require("../controllers/faqQustions");
const { faqQuestionSchema } = require("../schema/faqQuestionShema");

// FAQ
router.post("/question", validateBody(faqQuestionSchema), addNewQuestions);

module.exports = router;
