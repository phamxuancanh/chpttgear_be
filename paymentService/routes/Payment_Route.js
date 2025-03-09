const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/Payment_Controller");


// Tạo thanh toán mới
router.post('/', paymentController.createPayment);

// Lấy thông tin thanh toán theo ID (bao gồm transaction)
router.get('/:paymentId', paymentController.getPaymentById);

// Lấy danh sách thanh toán theo order_id
router.get('/orders/:orderId', paymentController.getPaymentsByOrderId);

// Cập nhật trạng thái thanh toán
router.put('/:paymentId', paymentController.updatePayment);

// Xóa thanh toán
router.delete('/:paymentId', paymentController.deletePayment);

module.exports = router;
