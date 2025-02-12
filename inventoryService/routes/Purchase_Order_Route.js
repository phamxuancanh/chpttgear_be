const express = require("express");
const router = express.Router();
const purchaseOrderController = require("../controllers/Purchase_Order_Controller");

router.post("/", purchaseOrderController.createPurchaseOrder);
router.get("/getAll", purchaseOrderController.getAllPurchaseOrders);
router.get("/getByOrderId/:id", purchaseOrderController.getPurchaseOrderById);
router.get(
  "/getByProductId/:id",
  purchaseOrderController.getPurchaseOrderByProductId
);

module.exports = router;
