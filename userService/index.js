require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 1111;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to User Service!');
});

// Start server
app.listen(PORT, () => {
    console.log(`User Service is running on http://localhost:${PORT}`);
});