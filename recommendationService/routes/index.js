const express = require("express");
const router = express.Router();
const geminiRoutes = require("./gemini");
const gptRoutes = require("./gpt");

const { API_PREFIX } = require("../utils");
router.use(`${API_PREFIX}/recommendations`, geminiRoutes);
router.use(`${API_PREFIX}/recommendationsGPT`, gptRoutes);

module.exports = router;
