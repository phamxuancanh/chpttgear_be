const { Kafka } = require("kafkajs");
const { models } = require("../models"); // Import model Inventory
const Inventory = models.Inventory; // Lấy model Inventory
const { Op } = require("sequelize");
const Stock_In = require("../models/Stock_In");
const sequelize = require("../configs/database");

// const kafka = new Kafka({
//   clientId: process.env.CLIENT_ID || "chptt_gear",
//   brokers: [process.env.KAFKA_BROKER || "kafka:9092"],
// });

// const producer = kafka.producer(); // Khởi tạo producer

const createInventory = async (data) => {
  try {
    // Tạo mới inventory
    const newInventory = await Inventory.create(data);
    console.log("Inventory created successfully:", newInventory);

    // Gửi thông điệp đến topic "shipping-update-quantity"
    const message = {
      value: `Inventory created with ID: ${newInventory.id}`,
    };

    // await producer.connect();

    // Gửi thông điệp tới topic "shipping-update-quantity"
    // await producer.send({
    //   topic: "shipping-update-quantity", // Gửi tới topic shipping-update-quantity
    //   messages: [message],
    // });

    console.log("Message sent to 'shipping-update-quantity' topic");

    return newInventory;
  } catch (error) {
    console.error("Error creating inventory:", error.message);
    throw new Error(`Error creating inventory: ${error.message}`);
  }
};

const getAllProductInInventory = async (inventoryId) => {
  try {
    // Lấy danh sách product_id duy nhất từ bảng Stock_In
    const stockInRecords = await Stock_In.findAll({
      where: { inventory_id: inventoryId },
      attributes: [
        [sequelize.fn("DISTINCT", sequelize.col("product_id")), "product_id"],
      ], // Sử dụng DISTINCT để loại bỏ trùng lặp
    });

    // Lấy danh sách product_id
    const productIds = stockInRecords.map((record) => record.product_id);

    return productIds;
  } catch (error) {
    console.error("Error fetching product_ids:", error);
    throw error;
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

const updateInventoryQuantity = async (inventory_id, flag, quantity) => {
  try {
    const inventoryItem = await Inventory.findOne({
      where: { inventory_id: inventory_id },
    });

    if (!inventoryItem) {
      throw new Error("Product not found in inventory");
    }

    // Trừ số lượng sản phẩm đã đặt hàng
    inventoryItem.quantity_in_stock =
      inventoryItem.quantity_in_stock + quantity * flag;

    if (inventoryItem.quantity_in_stock < 0) {
      throw new Error("Not enough stock available");
    }

    await inventoryItem.save();
    return inventoryItem;
  } catch (error) {
    throw new Error(`Error updating inventory quantity: ${error.message}`);
  }
};

// Cập nhật số lượng tồn kho khi có Stock In
const increaseStock = async (inventory_id, quantity) => {
  const inventory = await Inventory.findOne({ where: { inventory_id } });
  if (!inventory) return null;

  console.log(inventory);
  console.log(quantity);

  inventory.quantity_in_stock += quantity;
  await inventory.save();
  return inventory;
};

// Cập nhật số lượng tồn kho khi có Stock Out
const decreaseStock = async (inventory_id, quantity) => {
  const inventory = await Inventory.findOne({ where: { inventory_id } });
  if (!inventory) return null;

  if (inventory.quantity < quantity) {
    throw new Error("Not enough stock available");
  }

  inventory.quantity -= quantity;
  await inventory.save();
  return inventory;
};

const checkStock = async (product_id, quantity) => {
  const inventory = await Inventory.findOne({ where: { product_id } });
  if (!inventory) {
    return { available: false, message: "Product not found" };
  }

  if (inventory.quantity >= quantity) {
    return {
      available: true,
      message: "Stock available",
      stock: inventory.quantity,
    };
  } else {
    return {
      available: false,
      message: "Not enough stock",
      stock: inventory.quantity,
    };
  }
};

const getQuantityInStockByProductId = async (productId) => {
  try {
    const stockIn =
      (await models.Stock_In.sum("quantity", {
        where: { product_id: productId },
      })) || 0;
    const stockOut =
      (await models.Stock_Out.sum("quantity", {
        where: { product_id: productId },
      })) || 0;

    return stockIn - stockOut;
  } catch (error) {
    throw new Error("Lỗi khi lấy tồn kho: " + error.message);
  }
};
const getQuantityInStockByProductIdAndInventoryId = async (
  productId,
  inventoryId
) => {
  try {
    const stockIn =
      (await models.Stock_In.sum("quantity", {
        where: { product_id: productId, inventory_id: inventoryId },
      })) || 0;

    const stockOut =
      (await models.Stock_Out.sum("quantity", {
        where: { product_id: productId, inventory_id: inventoryId },
      })) || 0;

    return stockIn - stockOut;
  } catch (error) {
    throw new Error("Lỗi khi lấy tồn kho: " + error.message);
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
  decreaseStock,
  increaseStock,
  checkStock,
  getQuantityInStockByProductId,
  getQuantityInStockByProductIdAndInventoryId,
};
