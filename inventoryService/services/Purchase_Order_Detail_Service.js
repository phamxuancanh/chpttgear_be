const { models } = require("../models");
const PurchaseOrderDetail = models.Purchase_Order_Detail;
const Inventory = models.Inventory;

// Service để tạo mới PurchaseOrderDetail
const createPurchaseOrderDetail = async (order_id, data) => {
  try {
    const newDetail = await PurchaseOrderDetail.create({
      purchase_order_id: order_id,
      ...data,
    });

    // Sau khi tạo PurchaseOrderDetail, cập nhật lại số lượng tồn kho
    await updateInventoryQuantity(data.product_id, data.quantity);

    return newDetail;
  } catch (error) {
    throw new Error(`Error creating purchase order detail: ${error.message}`);
  }
};

// Service để cập nhật số lượng tồn kho sau khi tạo chi tiết đơn hàng
const updateInventoryQuantity = async (product_id, quantity) => {
  try {
    const inventory = await Inventory.findOne({
      where: { product_id: product_id },
    });
    if (inventory) {
      inventory.quantity_in_stock += quantity;
      await inventory.save();
    }
  } catch (error) {
    throw new Error(`Error updating inventory quantity: ${error.message}`);
  }
};

// Service để lấy tất cả PurchaseOrderDetail theo order id
const getPurchaseOrderDetailsByOrderId = async (purchase_order_id) => {
  try {
    const details = await PurchaseOrderDetail.findAll({
      where: { purchase_order_id: purchase_order_id },
    });
    return details;
  } catch (error) {
    throw new Error(`Error fetching purchase order details: ${error.message}`);
  }
};

// Service để xóa một PurchaseOrderDetail
const deletePurchaseOrderDetail = async (purchase_order_detail_id) => {
  try {
    const detail = await PurchaseOrderDetail.findByPk(purchase_order_detail_id);
    if (!detail) {
      throw new Error("Purchase order detail not found");
    }
    await detail.destroy();

    // Cập nhật lại số lượng tồn kho khi xóa chi tiết đơn hàng
    await updateInventoryQuantity(detail.product_id, -detail.quantity);

    return { message: "Purchase order detail deleted successfully" };
  } catch (error) {
    throw new Error(`Error deleting purchase order detail: ${error.message}`);
  }
};

module.exports = {
  createPurchaseOrderDetail,
  getPurchaseOrderDetailsByOrderId,
  deletePurchaseOrderDetail,
};
