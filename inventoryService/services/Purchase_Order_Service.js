const { models } = require("../models");
const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");
const Purchase_Order = require("../models/Purchase_Order");
const Purchase_Order_Detail = require("../models/Purchase_Order_Detail");
const { updateInventoryQuantity } = require("./Inventory_Service");
const sequelize = require("../configs/database");
const PurchaseOrder = models.Purchase_Order;
const { v4: uuidv4, validate: isUUID } = require("uuid");

const createPurchaseOrder = async (orderData) => {
  const transaction = await sequelize.transaction();

  try {
    const { orderDetails, ...orderInfo } = orderData;

    console.log("📝 Order Info:", orderInfo);
    console.log("📦 Order Details:", orderDetails);

    if (
      !orderDetails ||
      !Array.isArray(orderDetails) ||
      orderDetails.length === 0
    ) {
      throw new Error("Order details must be a non-empty array.");
    }

    // 🔹 Tạo UUID trước khi tạo đơn hàng
    const purchaseOrderId = uuidv4();
    orderInfo.purchase_order_id = purchaseOrderId;

    // 1️⃣ Tạo đơn hàng
    const newOrder = await Purchase_Order.create(orderInfo, { transaction });
    console.log("✅ Đã tạo đơn hàng:", newOrder);

    // 2️⃣ Tạo chi tiết đơn hàng với UUID cho từng chi tiết
    const orderDetailsWithOrderId = orderDetails.map((detail) => ({
      purchase_order_detail_id: uuidv4(), // Tạo UUID riêng cho mỗi chi tiết
      purchase_order_id: purchaseOrderId, // Dùng UUID của đơn hàng đã tạo trước đó
      ...detail,
    }));

    console.log("📌 Loại dữ liệu purchase_order_id:", typeof purchaseOrderId);
    console.log("📦 Order Details:", orderDetailsWithOrderId);

    const newDetails = await Purchase_Order_Detail.bulkCreate(
      orderDetailsWithOrderId,
      { transaction }
    );
    console.log("✅ Đã tạo chi tiết đơn hàng:", newDetails);

    let total = 0;
    // 3️⃣ Cập nhật tồn kho
    for (const detail of orderDetails) {
      console.log("🔄 Cập nhật tồn kho cho sản phẩm:", detail.product_id);
      total = total + detail.quantity;
    }
    await updateInventoryQuantity(newOrder.inventory_id, total, transaction);

    await transaction.commit();
    return { newOrder, newDetails };
  } catch (error) {
    console.error("❌ Lỗi tạo đơn hàng:", error.message);
    await transaction.rollback();
    throw new Error(`Error creating purchase order: ${error.message}`);
  }
};

// Service để lấy tất cả PurchaseOrder
const getAllPurchaseOrders = async () => {
  try {
    const purchaseOrders = await PurchaseOrder.findAll({
      include: [
        {
          model: Purchase_Order_Detail,
          as: "purchase_order_detail", // Đảm bảo alias này khớp với tên bạn định nghĩa trong quan hệ
        },
      ],
    });
    return purchaseOrders;
  } catch (error) {
    throw new Error(`Error fetching purchase orders: ${error.message}`);
  }
};

// Service để lấy thông tin của một PurchaseOrder theo id
const getPurchaseOrderById = async (purchase_order_id) => {
  try {
    const order = await PurchaseOrder.findByPk(purchase_order_id, {
      include: [
        {
          model: Purchase_Order_Detail,
          as: "purchase_order_detail", // Đảm bảo alias này khớp với định nghĩa trong associations
        },
      ],
    });

    if (!order) {
      throw new Error("Purchase order not found");
    }

    return order;
  } catch (error) {
    throw new Error(`Error fetching purchase order by id: ${error.message}`);
  }
};

const getPurchaseOrderByProductId = async (product_id) => {
  try {
    const orders = await PurchaseOrder.findAll({
      include: [
        {
          model: Purchase_Order_Detail,
          as: "purchase_order_detail", // Đảm bảo alias này khớp với định nghĩa trong associations
          where: { product_id },
          required: true, // Chỉ lấy đơn hàng có sản phẩm này
        },
      ],
    });

    return orders; // Nếu không có đơn hàng nào, trả về []
  } catch (error) {
    console.error("❌ Lỗi khi lấy đơn hàng theo product_id:", error.message);
    throw new Error(
      `Error fetching purchase orders by product ID: ${error.message}`
    );
  }
};

module.exports = {
  createPurchaseOrder,
  getAllPurchaseOrders,
  getPurchaseOrderById,
  getPurchaseOrderByProductId,
};
