const purchaseOrderService = require("../services/Purchase_Order_Service");

const createPurchaseOrder = async (req, res) => {
  try {
    const newOrder = await purchaseOrderService.createPurchaseOrder(req.body);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllPurchaseOrders = async (req, res) => {
  console.log("lấy hết");
  try {
    const purchaseOrders = await purchaseOrderService.getAllPurchaseOrders();
    res.status(200).json(purchaseOrders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getPurchaseOrderById = async (req, res) => {
  try {
    const order = await purchaseOrderService.getPurchaseOrderById(
      req.params.id
    );
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getPurchaseOrderByProductId = async (req, res) => {
  try {
    const order = await purchaseOrderService.getPurchaseOrderByProductId(
      req.params.id
    );
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createPurchaseOrder,
  getAllPurchaseOrders,
  getPurchaseOrderById,
  getPurchaseOrderByProductId,
};
