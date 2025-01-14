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

const updatePurchaseOrderStatus = async (req, res) => {
  try {
    const order = await purchaseOrderService.updatePurchaseOrderStatus(
      req.params.id,
      req.body.status
    );
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deletePurchaseOrder = async (req, res) => {
  try {
    const result = await purchaseOrderService.deletePurchaseOrder(
      req.params.id
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createPurchaseOrder,
  getAllPurchaseOrders,
  getPurchaseOrderById,
  updatePurchaseOrderStatus,
  deletePurchaseOrder,
};
