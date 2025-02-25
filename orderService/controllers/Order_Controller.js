const orderService = require("../services/Order_Service");

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await orderService.getOrderById(orderId);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get orders by user ID
exports.getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await orderService.getOrdersByUserId(userId);

    if (!orders.length) {
      return res.status(404).json({ message: "Không có đơn hàng nào!" });
    }

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createOrder = async (req, res) => {
  const orderData = req.body;
  try {
    const newOrder = await orderService.createOrder(orderData);

    const emailContext = {
      orderId: newOrder.order_id,
    };

    await orderService.sendEmail(orderData.email, "Xác nhận đơn hàng", "../utils/confirmationEmail.hbs", emailContext);

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing order
exports.updateOrder = async (req, res) => {
  const { orderId } = req.params;
  const orderData = req.body;
  try {
    const updatedOrder = await orderService.updateOrder(orderId, orderData);
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    const result = await orderService.deleteOrder(orderId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
