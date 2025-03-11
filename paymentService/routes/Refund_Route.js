const express = require('express');
const refundController = require('../controllers/Refund_Controller');

const router = express.Router();

router.post('/', refundController.createRefund);
router.get('/:refund_id', refundController.getRefundById);
router.get('/payment/:payment_id', refundController.getRefundsByPayment);
router.put('/:refund_id/status', refundController.updateRefundStatus);

module.exports = router;
