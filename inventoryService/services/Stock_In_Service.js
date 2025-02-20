const Inventory = require("../models/Inventory");
const StockIn = require("../models/Stock_In");
const { v4: uuidv4 } = require("uuid");

const getAllStockIn = async () => {
  return await StockIn.findAll();
};

const getStockInById = async (id) => {
  return await StockIn.findByPk(id);
};
const getStockInByInventoryId = async (inventoryId) => {
  try {
    const stockInRecords = await StockIn.findAll({
      where: {
        inventory_id: inventoryId, // Lọc theo inventory_id
      },
    });
    return stockInRecords; // Trả về danh sách các bản ghi stock_in tìm được
  } catch (error) {
    console.error("Lỗi khi lấy thông tin stock_in:", error);
    throw error; // Hoặc bạn có thể xử lý lỗi theo cách khác
  }
};

const getStockInByProductId = async (product_id) => {
  try {
    const stockInRecords = await StockIn.findAll({
      where: {
        product_id: product_id, // Lọc theo inventory_id
      },
    });
    return stockInRecords; // Trả về danh sách các bản ghi stock_in tìm được
  } catch (error) {
    console.error("Lỗi khi lấy thông tin stock_in:", error);
    throw error; // Hoặc bạn có thể xử lý lỗi theo cách khác
  }
};

const createStockIn = async (data) => {
  try {
    // In dữ liệu để kiểm tra
    console.log(data);

    // Thêm dữ liệu vào bảng Stock_In
    const stockInRecord = await StockIn.create({
      stock_id: uuidv4(),
      product_id: data.product_id,
      quantity: data.quantity,
      price: data.price,
      inventory_id: data.inventory_id,
      updatedAt: new Date(),
      createdAt: new Date(),
    });

    return stockInRecord;
  } catch (error) {
    console.error("Error creating stock-in record:", error);
    throw error;
  }
};

const updateStockIn = async (id, data) => {
  const stockIn = await StockIn.findByPk(id);
  if (!stockIn) return null;
  return await stockIn.update(data);
};

const deleteStockIn = async (id) => {
  return await StockIn.destroy({ where: { stock_in_id: id } });
};

module.exports = {
  getAllStockIn,
  getStockInById,
  createStockIn,
  updateStockIn,
  deleteStockIn,
  getStockInByInventoryId,
  getStockInByProductId,
};
