const { OrderService } = require("../services/");

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await OrderService.getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await OrderService.getOrderById(orderId);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get orders by user ID
exports.getOrderByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await OrderService.getOrderByUserId(userId);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createOrder = async (req, res) => {
  const orderData = req.body;
  try {
    const newOrder = await OrderService.createOrder(orderData);

    // const emailContext = {
    //     orderId: newOrder.order_id, 
    // };

    // await orderService.sendEmail(email, "Xác nhận đơn hàng", "../utils/orderConfirmation.hbs", emailContext);

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
    const updatedOrder = await OrderService.updateOrder(orderId, orderData);
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    const result = await OrderService.deleteOrder(orderId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
