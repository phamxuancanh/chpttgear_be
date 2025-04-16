const express = require("express");
const router = express.Router();

const gptController = require("../controllers/gpt");
router.post("/generate", gptController.generateContent);
router.post("/classify_review", gptController.classifyReview);
module.exports = router;
