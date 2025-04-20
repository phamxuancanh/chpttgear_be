const express = require("express");
const router = express.Router();

const gptController = require("../controllers/gpt");
router.post("/GPT/generate", gptController.generateContent);
router.post("/GPT/classify_review", gptController.classifyReview);
router.post("/GPT/generateAIDescription", gptController.generateDescription);
module.exports = router;
