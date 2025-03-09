const refundService = require('../services/Refund_Service');

const createRefund = async (req, res) => {
    try {
        const { payment_id, amount, reason } = req.body;
        const refund = await refundService.createRefund(payment_id, amount, reason);
        res.status(201).json({ success: true, data: refund });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const getRefundById = async (req, res) => {
    try {
        const { refund_id } = req.params;
        const refund = await refundService.getRefundById(refund_id);
        if (!refund) return res.status(404).json({ success: false, message: "Refund not found" });
        res.json({ success: true, data: refund });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getRefundsByPayment = async (req, res) => {
    try {
        const { payment_id } = req.params;
        const refunds = await refundService.getRefundsByPayment(payment_id);
        res.json({ success: true, data: refunds });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateRefundStatus = async (req, res) => {
    try {
        const { refund_id } = req.params;
        const { status } = req.body;
        const refund = await refundService.updateRefundStatus(refund_id, status);
        res.json({ success: true, data: refund });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    createRefund,
    getRefundById,
    getRefundsByPayment,
    updateRefundStatus
};
