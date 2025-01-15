const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/TransactionController');

router.post('/', transactionController.createTransaction);
router.get('/:id', transactionController.getTransactionById);
router.get('/payment/:payment_id', transactionController.getTransactionsByPaymentId);
router.put('/:id/status', transactionController.updateTransactionStatus);
router.post('/payment-response', transactionController.handlePaymentGatewayResponse);

module.exports = router;
