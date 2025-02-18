const StockOut = require("../models/Stock_Out");

const getAllStockOut = async () => {
  return await StockOut.findAll();
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
  return await StockOut.create(data);
};

const updateStockOut = async (id, data) => {
  const stockOut = await StockOut.findByPk(id);
  if (!stockOut) return null;
  return await stockOut.update(data);
};

const deleteStockOut = async (id) => {
  return await StockOut.destroy({ where: { stock_out_id: id } });
};

module.exports = {
  getAllStockOut,
  getStockOutById,
  createStockOut,
  updateStockOut,
  deleteStockOut,
  getStockOutByInventoryId,
};
