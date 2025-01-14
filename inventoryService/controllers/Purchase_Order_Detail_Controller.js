const purchaseOrderDetailService = require("../services/Purchase_Order_Detail_Service");

const createPurchaseOrderDetail = async (req, res) => {
  try {
    const newDetail =
      await purchaseOrderDetailService.createPurchaseOrderDetail(
        req.params.order_id,
        req.body
      );
    res.status(201).json(newDetail);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getPurchaseOrderDetailsByOrderId = async (req, res) => {
  try {
    const details =
      await purchaseOrderDetailService.getPurchaseOrderDetailsByOrderId(
        req.params.order_id
      );
    res.status(200).json(details);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deletePurchaseOrderDetail = async (req, res) => {
  try {
    const result = await purchaseOrderDetailService.deletePurchaseOrderDetail(
      req.params.id
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createPurchaseOrderDetail,
  getPurchaseOrderDetailsByOrderId,
  deletePurchaseOrderDetail,
};
