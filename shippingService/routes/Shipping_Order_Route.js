const express = require("express");
const router = express.Router();
const shippingOrderController = require("../controllers/Shipping_Order_Controller");

router.get("/", shippingOrderController.getAll);
router.post("/", shippingOrderController.create);
router.get("/:user_id", shippingOrderController.getByUserId);
router.get("/order/:order_id", shippingOrderController.getOrderByOrderId);
router.post("/calculate-fee", shippingOrderController.getShippingFee);

module.exports = router;
