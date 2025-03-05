const paymentService = require("../services/Payment_Service");

exports.createPayment = async (req, res) => {
  try {
    const payment = await paymentService.createPayment(req.body);
    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.paypalPaymentSuccess = async (req, res) => {
  try {
    const result = await paymentService.handlePaypalSuccess(req.query);
    res
      .status(200)
      .json({ success: true, message: "Payment successful", data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.paypalPaymentCancel = async (req, res) => {
  try {
    await paymentService.handlePaypalCancel(req.query);
    res
      .status(200)
      .json({ success: true, message: "Payment has been cancelled" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPaymentById = async (req, res) => {
  const { paymentId } = req.params;
  try {
    const payment = await paymentService.getPaymentById(paymentId);
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPaymentsByOrderId = async (req, res) => {
  const { orderId } = req.params;
  try {
    const payments = await paymentService.getPaymentsByOrderId(orderId);
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePayment = async (req, res) => {
  const { paymentId } = req.params;
  const paymentData = req.body;
  try {
    const updatedPayment = await paymentService.updatePayment(
      paymentId,
      paymentData
    );
    res.status(200).json(updatedPayment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePayment = async (req, res) => {
  const { paymentId } = req.params;
  try {
    const response = await paymentService.deletePayment(paymentId);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
