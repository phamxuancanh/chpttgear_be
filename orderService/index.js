require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3333;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to Order Service!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Order Service is running on http://localhost:${PORT}`);
});