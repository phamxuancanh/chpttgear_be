const express = require("express");
const router = express.Router();
const geminiRoutes = require("./gemini");
const { API_PREFIX } = require("../utils");
router.use(`${API_PREFIX}/recommendations`, geminiRoutes);
module.exports = router;
