const orderItemService = require("../services/OrderItem_Service");

// Lấy tất cả các order item trong đơn hàng
exports.getAllOrderItemsByOrderId = async (req, res) => {
  const { orderId } = req.params;
  try {
    const orderItems = await orderItemService.getAllOrderItemsByOrderId(
      orderId
    );
    res.status(200).json(orderItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy thông tin order item theo ID
exports.getOrderItemById = async (req, res) => {
  const { orderItemId } = req.params;
  try {
    const orderItem = await orderItemService.getOrderItemById(orderItemId);
    res.status(200).json(orderItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Tạo một order item mới
exports.createOrderItem = async (req, res) => {
  const orderItemData = req.body;
  try {
    const newOrderItem = await orderItemService.createOrderItem(orderItemData);
    res.status(201).json(newOrderItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật thông tin order item
exports.updateOrderItem = async (req, res) => {
  const { orderItemId } = req.params;
  const orderItemData = req.body;
  try {
    const updatedOrderItem = await orderItemService.updateOrderItem(
      orderItemId,
      orderItemData
    );
    res.status(200).json(updatedOrderItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xóa order item
exports.deleteOrderItem = async (req, res) => {
  const { orderItemId } = req.params;
  try {
    const result = await orderItemService.deleteOrderItem(orderItemId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
