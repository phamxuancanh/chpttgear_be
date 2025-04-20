const express = require("express");
const router = express.Router();

const geminiController = require("../controllers/gemini");
router.post("/GMN/generate", geminiController.generateContent);
module.exports = router;
