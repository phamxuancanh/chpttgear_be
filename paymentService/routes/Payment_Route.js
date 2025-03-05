const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/Payment_Controller");

router.post("/", paymentController.createPayment);

router.get("/paypal/success", paymentController.paypalPaymentSuccess);

router.get("/paypal/cancel", paymentController.paypalPaymentCancel);

router.get("/:paymentId", paymentController.getPaymentById);

router.get("/order/:orderId", paymentController.getPaymentsByOrderId);

router.put("/:paymentId", paymentController.updatePayment);

router.delete("/:paymentId", paymentController.deletePayment);

module.exports = router;
