require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 2223;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to Shipping Service!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Shipping Service is running on http://localhost:${PORT}`);
});