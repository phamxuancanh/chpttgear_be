const stockOutService = require("../services/Stock_Out_Service");

const getAllStockOut = async (req, res) => {
  const data = await stockOutService.getAllStockOut();
  res.json(data);
};

const getStockOutById = async (req, res) => {
  const data = await stockOutService.getStockOutById(req.params.id);
  data
    ? res.json(data)
    : res.status(404).json({ message: "Stock Out not found" });
};

const createStockOut = async (req, res) => {
  console.log("tới đây rồi");
  console.log(req.body);
  const data = await stockOutService.createStockOut(req.body);
  res.status(201).json(data);
};

const updateStockOut = async (req, res) => {
  const data = await stockOutService.updateStockOut(req.params.id, req.body);
  data
    ? res.json(data)
    : res.status(404).json({ message: "Stock Out not found" });
};

const deleteStockOut = async (req, res) => {
  const success = await stockOutService.deleteStockOut(req.params.id);
  success
    ? res.json({ message: "Deleted successfully" })
    : res.status(404).json({ message: "Stock Out not found" });
};

const getStockOutByInventoryId = async (req, res) => {
  const { inventory_id } = req.params; // Lấy inventory_id từ params

  try {
    // Tìm tất cả các bản ghi stock_in theo inventory_id
    const stockInRecords = await stockOutService.getStockOutByInventoryId(
      inventory_id
    );

    // Kiểm tra nếu không có kết quả
    if (stockInRecords.length === 0) {
      return res
        .status(404)
        .json({ message: "Không có dữ liệu stock_in với inventory_id này" });
    }

    // Trả về dữ liệu stock_in tìm được
    return res.status(200).json(stockInRecords);
  } catch (error) {
    console.error("Lỗi khi lấy thông tin stock_in:", error);
    return res
      .status(500)
      .json({ message: "Có lỗi xảy ra khi lấy dữ liệu stock_in" });
  }
};

module.exports = {
  getAllStockOut,
  getStockOutById,
  createStockOut,
  updateStockOut,
  deleteStockOut,
  getStockOutByInventoryId,
};
