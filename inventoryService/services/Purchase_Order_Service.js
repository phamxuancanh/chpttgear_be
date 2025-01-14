const { models } = require("../models");
const PurchaseOrder = models.Purchase_Order;
const Inventory = models.Inventory;

// Service để tạo mới một PurchaseOrder
const createPurchaseOrder = async (data) => {
  try {
    const newOrder = await PurchaseOrder.create(data);
    return newOrder;
  } catch (error) {
    throw new Error(`Error creating purchase order: ${error.message}`);
  }
};

// Service để lấy tất cả PurchaseOrder
const getAllPurchaseOrders = async () => {
  try {
    const purchaseOrders = await PurchaseOrder.findAll();
    return purchaseOrders;
  } catch (error) {
    throw new Error(`Error fetching purchase orders: ${error.message}`);
  }
};

// Service để lấy thông tin của một PurchaseOrder theo id
const getPurchaseOrderById = async (purchase_order_id) => {
  try {
    const order = await PurchaseOrder.findByPk(purchase_order_id);
    if (!order) {
      throw new Error("Purchase order not found");
    }
    return order;
  } catch (error) {
    throw new Error(`Error fetching purchase order by id: ${error.message}`);
  }
};

// Service để cập nhật trạng thái của PurchaseOrder
const updatePurchaseOrderStatus = async (purchase_order_id, status) => {
  try {
    const order = await PurchaseOrder.findByPk(purchase_order_id);
    if (!order) {
      throw new Error("Purchase order not found");
    }
    order.status = status;
    await order.save();
    return order;
  } catch (error) {
    throw new Error(`Error updating purchase order status: ${error.message}`);
  }
};

// Service để xóa PurchaseOrder
const deletePurchaseOrder = async (purchase_order_id) => {
  try {
    const order = await PurchaseOrder.findByPk(purchase_order_id);
    if (!order) {
      throw new Error("Purchase order not found");
    }
    await order.destroy();
    return { message: "Purchase order deleted successfully" };
  } catch (error) {
    throw new Error(`Error deleting purchase order: ${error.message}`);
  }
};

module.exports = {
  createPurchaseOrder,
  getAllPurchaseOrders,
  getPurchaseOrderById,
  updatePurchaseOrderStatus,
  deletePurchaseOrder,
};
