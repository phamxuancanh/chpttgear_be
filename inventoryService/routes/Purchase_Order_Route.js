const express = require("express");
const router = express.Router();
const purchaseOrderController = require("../controllers/Purchase_Order_Controller");

router.post("/", purchaseOrderController.createPurchaseOrder);
router.get("/", purchaseOrderController.getAllPurchaseOrders);
router.get("/:id", purchaseOrderController.getPurchaseOrderById);
router.put("/:id/status", purchaseOrderController.updatePurchaseOrderStatus);
router.delete("/:id", purchaseOrderController.deletePurchaseOrder);

module.exports = router;
