const express = require("express");
const router = express.Router();
const purchaseOrderDetailController = require("../controllers/Purchase_Order_Detail_Controller");

router.post(
  "/:order_id",
  purchaseOrderDetailController.createPurchaseOrderDetail
);
router.get(
  "/:order_id",
  purchaseOrderDetailController.getPurchaseOrderDetailsByOrderId
);
router.delete("/:id", purchaseOrderDetailController.deletePurchaseOrderDetail);

module.exports = router;
