const express = require("express");
const router = express.Router();

const gptController = require("../controllers/gpt");
router.post("/generate", gptController.generateContent);
module.exports = router;
