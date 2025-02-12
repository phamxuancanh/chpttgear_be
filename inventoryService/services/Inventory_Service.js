const { Kafka } = require("kafkajs");
const { models } = require("../models"); // Import model Inventory
const Inventory = models.Inventory; // Lấy model Inventory
const { Op } = require("sequelize");
const PurchaseOrder = models.Purchase_Order;
const PurchaseOrderDetail = models.Purchase_Order_Detail;

const kafka = new Kafka({
  clientId: process.env.CLIENT_ID || "chptt_gear",
  brokers: [process.env.KAFKA_BROKER || "kafka:9092"],
});

const producer = kafka.producer(); // Khởi tạo producer

const createInventory = async (data) => {
  try {
    // Tạo mới inventory
    const newInventory = await Inventory.create(data);
    console.log("Inventory created successfully:", newInventory);

    // Gửi thông điệp đến topic "shipping-update-quantity"
    const message = {
      value: `Inventory created with ID: ${newInventory.id}`,
    };

    await producer.connect();

    // Gửi thông điệp tới topic "shipping-update-quantity"
    await producer.send({
      topic: "shipping-update-quantity", // Gửi tới topic shipping-update-quantity
      messages: [message],
    });

    console.log("Message sent to 'shipping-update-quantity' topic");

    return newInventory;
  } catch (error) {
    console.error("Error creating inventory:", error.message);
    throw new Error(`Error creating inventory: ${error.message}`);
  }
};

const getAllProductInInventory = async (inventory_id) => {
  try {
    // Lấy thông tin các đơn hàng từ Inventory
    const purchaseOrders = await PurchaseOrder.findAll({
      where: { inventory_id: inventory_id },
      include: [
        {
          model: PurchaseOrderDetail,
          include: ["Product"], // Nếu Product là một model riêng biệt và có quan hệ với PurchaseOrderDetail
        },
      ],
    });

    // Tạo một mảng chứa các sản phẩm (Product) từ các chi tiết đơn hàng
    const productsInInventory = [];
    purchaseOrders.forEach((order) => {
      order.PurchaseOrderDetails.forEach((detail) => {
        productsInInventory.push(detail.Product); // Lấy sản phẩm từ PurchaseOrderDetail
      });
    });

    return productsInInventory;
  } catch (error) {
    throw new Error(`Error fetching products in inventory: ${error.message}`);
  }
};

// Service để lấy tất cả inventories
const getAllInventory = async () => {
  try {
    const inventories = await Inventory.findAll();
    return inventories;
  } catch (error) {
    throw new Error(`Error fetching inventories: ${error.message}`);
  }
};

// Service để lấy thông tin của một inventory bằng id
const getInventoryById = async (inventory_id) => {
  try {
    const inventory = await Inventory.findByPk(inventory_id);
    if (!inventory) {
      throw new Error("Inventory not found");
    }
    return inventory;
  } catch (error) {
    throw new Error(`Error fetching inventory by id: ${error.message}`);
  }
};

// Service để cập nhật thông tin inventory
const updateInventory = async (inventory_id, data) => {
  try {
    const inventory = await Inventory.findByPk(inventory_id);
    if (!inventory) {
      throw new Error("Inventory not found");
    }
    await inventory.update(data);
    return inventory;
  } catch (error) {
    throw new Error(`Error updating inventory: ${error.message}`);
  }
};

// Service để xóa inventory
const deleteInventory = async (inventory_id) => {
  try {
    const inventory = await Inventory.findByPk(inventory_id);
    if (!inventory) {
      throw new Error("Inventory not found");
    }
    await inventory.destroy();
    return { message: "Inventory deleted successfully" };
  } catch (error) {
    throw new Error(`Error deleting inventory: ${error.message}`);
  }
};

const updateInventoryQuantity = async (product_id, quantity) => {
  try {
    const inventoryItem = await Inventory.findOne({
      where: { inventory_id: product_id },
    });

    if (!inventoryItem) {
      throw new Error("Product not found in inventory");
    }

    // Trừ số lượng sản phẩm đã đặt hàng
    inventoryItem.quantity_in_stock += quantity;

    if (inventoryItem.quantity_in_stock < 0) {
      throw new Error("Not enough stock available");
    }

    await inventoryItem.save();
    return inventoryItem;
  } catch (error) {
    throw new Error(`Error updating inventory quantity: ${error.message}`);
  }
};

module.exports = {
  createInventory,
  getAllInventory,
  getInventoryById,
  updateInventory,
  deleteInventory,
  getAllProductInInventory,
  updateInventoryQuantity,
};
