const express = require('express');
const orderController = require('../controllers/OrderController');
const router = express.Router();

// Get all orders
router.get('/', orderController.getAllOrders);

// Get order by ID
router.get('/:orderId', orderController.getOrderById);

// Get orders by user ID
router.get('/user/:userId', orderController.getOrderByUserId);

// Create a new order
router.post('/', orderController.createOrder);

// Update an order
router.put('/:orderId', orderController.updateOrder);

// Delete an order
router.delete('/:orderId', orderController.deleteOrder);

module.exports = router;
