require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 2222;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to Inventory Service!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Inventory Service is running on http://localhost:${PORT}`);
});