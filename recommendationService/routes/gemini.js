const express = require("express");
const router = express.Router();

const geminiController = require("../controllers/gemini");
router.post("/generate", geminiController.generateContent);
module.exports = router;
