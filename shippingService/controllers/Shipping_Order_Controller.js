const shippingOrderService = require("../services/Shipping_Order_Service");

const getAll = async (req, res) => {
  try {
    console.log("getALL");
    const orders = await shippingOrderService.getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const create = async (req, res) => {
  try {
    const newOrder = await shippingOrderService.createOrder(req.body);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const getByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;
    const orders = await shippingOrderService.getOrdersByUserId(user_id);
    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const getOrderByOrderId = async (req, res) => {
  try {
    const { order_id } = req.params;
    if (!order_id) {
      return res.status(400).json({ message: "Thiếu order_id" });
    }

    const order = await shippingOrderService.getOrderByOrderId(order_id);
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAll,
  create,
  getByUserId,
  getOrderByOrderId,
};
