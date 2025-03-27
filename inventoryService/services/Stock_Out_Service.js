const Inventory = require("../models/Inventory");
const StockOut = require("../models/Stock_Out");
const StockIn = require("../models/Stock_In");
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

const getAllStockOut = async () => {
  return await StockOut.findAll({
    include: [
      {
        model: Inventory,
        as: "inventory", // Đảm bảo alias đúng với định nghĩa trong association
      },
    ],
  });
};

const getStockOutById = async (id) => {
  return await StockOut.findByPk(id);
};

const getStockOutByInventoryId = async (inventoryId) => {
  try {
    const stockOutRecords = await StockOut.findAll({
      where: {
        inventory_id: inventoryId, // Lọc theo inventory_id
      },
    });
    return stockOutRecords; // Trả về danh sách các bản ghi stock_in tìm được
  } catch (error) {
    console.error("Lỗi khi lấy thông tin stock_out:", error);
    throw error; // Hoặc bạn có thể xử lý lỗi theo cách khác
  }
};

const createStockOut = async (data) => {
  console.log(data);
  const { productId, quantityToExport, orderId } = data;
  let remainingQuantity = quantityToExport;

  // Lấy danh sách nhập kho theo FIFO (không có inventory_id)
  const stockEntries = await StockIn.findAll({
    where: { product_id: productId },
    order: [["createdAt", "ASC"]], // Lấy hàng nhập trước
  });

  let stockOutRecords = [];

  for (let entry of stockEntries) {
    if (remainingQuantity <= 0) break; // Nếu đã đủ số lượng cần xuất, thoát vòng lặp

    let usedQuantity = Math.min(entry.quantity, remainingQuantity);
    remainingQuantity -= usedQuantity;

    // Ghi nhận xuất kho từ từng lô nhập
    stockOutRecords.push({
      stock_out_id: uuidv4(),
      product_id: productId,
      quantity: usedQuantity,
      order_id: orderId,
      inventory_id: entry.inventory_id, // Dùng inventory_id từ Stock_In
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Kiểm tra xem có đủ hàng để xuất không
  const totalStock = stockEntries.reduce(
    (sum, entry) => sum + entry.quantity,
    0
  );
  if (quantityToExport > totalStock) {
    throw new Error(`Không đủ hàng để xuất! Chỉ còn ${totalStock} sản phẩm.`);
  }

  // Ghi dữ liệu xuất kho vào bảng Stock_Out
  await StockOut.bulkCreate(stockOutRecords);

  return stockOutRecords;
};

const updateStockOut = async (id, data) => {
  const stockOut = await StockOut.findByPk(id);
  if (!stockOut) return null;
  return await stockOut.update(data);
};

const deleteStockOut = async (id) => {
  return await StockOut.destroy({ where: { stock_out_id: id } });
};

const getStockOutByProductId = async (product_id) => {
  try {
    const stockOutRecords = await StockOut.findAll({
      where: {
        product_id: product_id, // Lọc theo inventory_id
      },
    });
    return stockOutRecords; // Trả về danh sách các bản ghi stock_in tìm được
  } catch (error) {
    console.error("Lỗi khi lấy thông tin stock_in:", error);
    throw error; // Hoặc bạn có thể xử lý lỗi theo cách khác
  }
};

module.exports = {
  getAllStockOut,
  getStockOutById,
  createStockOut,
  updateStockOut,
  deleteStockOut,
  getStockOutByInventoryId,
  getStockOutByProductId,
};
