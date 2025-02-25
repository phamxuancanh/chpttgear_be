const express = require('express');
const orderItemController = require('../controllers/Order_Item_Controller');
const router = express.Router();

// Lấy tất cả các order item trong đơn hàng
router.get('/order/:orderId', orderItemController.getAllOrderItemsByOrderId);

// Lấy thông tin order item theo ID
router.get('/:orderItemId', orderItemController.getOrderItemById);

// Tạo một order item mới
router.post('/', orderItemController.createOrderItem);

// Cập nhật thông tin order item
router.put('/:orderItemId', orderItemController.updateOrderItem);

// Xóa order item
router.delete('/:orderItemId', orderItemController.deleteOrderItem);

module.exports = router;
