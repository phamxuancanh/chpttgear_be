
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3334;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to Recommendation Service!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Recommendation Service is running on http://localhost:${PORT}`);
});