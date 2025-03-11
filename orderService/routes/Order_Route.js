const express = require('express');
const orderController = require('../controllers/Order_Controller');
const router = express.Router();

// Get all orders
router.get('/', orderController.getAllOrders);

// Get order by ID
router.get('/:orderId', orderController.getOrderById);

// Get orders by user ID
router.get('/orders/:userId', orderController.getOrdersByUserId);

// Create a new order
router.post('/', orderController.createOrder);

// Update an order
router.put('/:orderId', orderController.updateOrder);

// Delete an order
router.delete('/:orderId', orderController.deleteOrder);

router.post("/calculate-fee", orderController.getShippingFee);

router.get("/paypal/cancel", orderController.paypalOrderCancel);

router.get("/paypal/success", orderController.paypalOrderSuccess);

module.exports = router;
