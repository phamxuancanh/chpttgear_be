const express = require("express");
const router = express.Router();
const stockInController = require("../controllers/Stock_In_Controller");

router.get("/getAll", stockInController.getAllStockIn);
router.get("/getById/:id", stockInController.getStockInById);
router.post("/", stockInController.createStockIn);
router.put("/:id", stockInController.updateStockIn);
router.delete("/:id", stockInController.deleteStockIn);
router.get(
  "/getByInventoryId/:inventory_id",
  stockInController.getStockInByInventoryId
);
router.get(
  "/getByProductId/:product_id",
  stockInController.getStockInByProductId
);

module.exports = router;
