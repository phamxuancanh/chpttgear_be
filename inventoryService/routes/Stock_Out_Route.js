const express = require("express");
const router = express.Router();
const stockOutController = require("../controllers/Stock_Out_Controller");

router.get("/getAll", stockOutController.getAllStockOut);
router.get("/:id", stockOutController.getStockOutById);
router.post("/", stockOutController.createStockOut);
router.put("/:id", stockOutController.updateStockOut);
router.delete("/:id", stockOutController.deleteStockOut);
router.get(
  "/getByInventoryId/:inventory_id",
  stockOutController.getStockOutByInventoryId
);

module.exports = router;
