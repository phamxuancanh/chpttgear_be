const express = require("express");
const inventoryController = require("../controllers/Inventory_Controller");
const router = express.Router();

router.get(
  "/getQuantityInStockByProductIdAndInventoryId",
  inventoryController.getQuantityInStockByProductIdAndInventoryId
);
// Route cho các yêu cầu CRUD đối với Inventory
router.post("/", inventoryController.createInventory); // Tạo mới inventory
router.get("/", inventoryController.getAllInventory); // Lấy tất cả inventories
router.get("/:inventory_id", inventoryController.getInventoryById); // Lấy inventory theo id
router.put("/:inventory_id", inventoryController.updateInventory); // Cập nhật inventory
router.delete("/:inventory_id", inventoryController.deleteInventory); // Xóa inventory
router.get(
  "/:inventory_id/products",
  inventoryController.getAllProductInInventory
);
router.put("/:inventory_id/increase", inventoryController.increaseStock);
router.put("/:inventory_id/decrease", inventoryController.decreaseStock);
router.post("/:product_id/check-stock", inventoryController.checkStock);
router.get(
  "/getQuantityInStockByProductId/:product_id/",
  inventoryController.getQuantityInStock
);

router.post("/calculate-fee", inventoryController.getShippingFee);

module.exports = router;
