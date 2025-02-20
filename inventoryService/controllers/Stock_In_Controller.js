const stockInService = require("../services/Stock_In_Service");

const getAllStockIn = async (req, res) => {
  const data = await stockInService.getAllStockIn();
  res.json(data);
};

const getStockInById = async (req, res) => {
  const data = await stockInService.getStockInById(req.params.id);
  data
    ? res.json(data)
    : res.status(404).json({ message: "Stock In not found", status: 404 });
};

const createStockIn = async (req, res) => {
  const data = await stockInService.createStockIn(req.body.data);
  res.status(201).json(data);
};

const updateStockIn = async (req, res) => {
  const data = await stockInService.updateStockIn(req.params.id, req.body);
  data
    ? res.json(data)
    : res.status(404).json({ message: "Stock In not found" });
};

const deleteStockIn = async (req, res) => {
  const success = await stockInService.deleteStockIn(req.params.id);
  success
    ? res.json({ message: "Deleted successfully" })
    : res.status(404).json({ message: "Stock In not found" });
};

const getStockInByInventoryId = async (req, res) => {
  const { inventory_id } = req.params; // Lấy inventory_id từ params

  try {
    // Tìm tất cả các bản ghi stock_in theo inventory_id
    const stockInRecords = await stockInService.getStockInByInventoryId(
      inventory_id
    );

    // Kiểm tra nếu không có kết quả
    if (stockInRecords.length === 0) {
      return res.status(404).json({
        message: "Không có dữ liệu stock_in với inventory_id này",
        status: 404,
      });
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

const getStockInByProductId = async (req, res) => {
  const { product_id } = req.params; // Lấy inventory_id từ params

  try {
    // Tìm tất cả các bản ghi stock_in theo inventory_id
    const stockInRecords = await stockInService.getStockInByProductId(
      product_id
    );

    // Kiểm tra nếu không có kết quả
    if (stockInRecords.length === 0) {
      return res.status(404).json({
        message: "Không có dữ liệu stock_in với inventory_id này",
        status: 404,
      });
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
  getAllStockIn,
  getStockInById,
  createStockIn,
  updateStockIn,
  deleteStockIn,
  getStockInByInventoryId,
  getStockInByProductId,
};
