const express = require("express");
const router = express.Router();
const userRoutes = require("./user");
const { API_PREFIX } = require("../utils");
router.use(`${API_PREFIX}/users`, userRoutes);
module.exports = router;
