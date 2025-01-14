const inventoryService = require("../services/Inventory_Service");

// Tạo mới một inventory
const createInventory = async (req, res) => {
  try {
    const data = req.body; // Lấy dữ liệu từ request body
    const newInventory = await inventoryService.createInventory(data);
    res.status(201).json(newInventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy tất cả inventories
const getAllInventory = async (req, res) => {
  try {
    const inventories = await inventoryService.getAllInventory();
    res.status(200).json(inventories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy thông tin inventory theo id
const getInventoryById = async (req, res) => {
  try {
    const { inventory_id } = req.params;
    const inventory = await inventoryService.getInventoryById(inventory_id);
    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật thông tin inventory
const updateInventory = async (req, res) => {
  try {
    const { inventory_id } = req.params;
    const data = req.body;
    const updatedInventory = await inventoryService.updateInventory(
      inventory_id,
      data
    );
    res.status(200).json(updatedInventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa inventory
const deleteInventory = async (req, res) => {
  try {
    const { inventory_id } = req.params;
    const response = await inventoryService.deleteInventory(inventory_id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllProductInInventory = async (req, res) => {
  try {
    const { inventory_id } = req.params;
    const products = await inventoryService.getAllProductInInventory(
      inventory_id
    );
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createInventory,
  getAllInventory,
  getInventoryById,
  updateInventory,
  deleteInventory,
  getAllProductInInventory,
};
