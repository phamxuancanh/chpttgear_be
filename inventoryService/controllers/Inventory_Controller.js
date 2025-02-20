const inventoryService = require("../services/Inventory_Service");

// Tạo mới một inventory
const createInventory = async (req, res) => {
  try {
    const data = req.body.data; // Lấy dữ liệu từ request body
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
    if (inventories.length == 0) return [];
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
    res.status(404).json({ message: error.message });
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
    const inventoryId = req.params.inventory_id;

    const productIds = await inventoryService.getAllProductInInventory(
      inventoryId
    );

    res.status(200).json({
      success: true,
      data: productIds,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product_ids",
    });
  }
};

// Tăng tồn kho (Stock In)
const increaseStock = async (req, res) => {
  try {
    const data = await inventoryService.increaseStock(
      req.params.inventory_id,
      req.body.quantity
    );
    data
      ? res.json(data)
      : res.status(404).json({ message: "Product not found" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Giảm tồn kho (Stock Out)
const decreaseStock = async (req, res) => {
  try {
    const data = await inventoryService.decreaseStock(
      req.params.inventory_id,
      req.body.quantity
    );
    data
      ? res.json(data)
      : res
          .status(404)
          .json({ message: "Product not found or not enough stock" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const checkStock = async (req, res) => {
  const { product_id } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: "Invalid quantity" });
  }

  const result = await inventoryService.checkStock(product_id, quantity);
  res.json(result);
};

const getQuantityInStock = async (req, res) => {
  try {
    const { product_id } = req.params;
    if (!product_id) return res.status(400).json({ error: "Thiếu product_id" });

    const quantityInStock =
      await inventoryService.getQuantityInStockByProductId(product_id);
    res.json({ product_id, quantityInStock });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getQuantityInStockByProductIdAndInventoryId = async (req, res) => {
  try {
    const { product_id, inventory_id } = req.query;

    if (!product_id || !inventory_id) {
      return res
        .status(400)
        .json({ error: "Thiếu product_id hoặc inventory_id" });
    }

    const quantityInStock =
      await inventoryService.getQuantityInStockByProductIdAndInventoryId(
        product_id,
        inventory_id
      );
    res.json({ product_id, inventory_id, quantityInStock });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createInventory,
  getAllInventory,
  getInventoryById,
  updateInventory,
  deleteInventory,
  getAllProductInInventory,
  decreaseStock,
  increaseStock,
  checkStock,
  getQuantityInStock,
  getQuantityInStockByProductIdAndInventoryId,
};
