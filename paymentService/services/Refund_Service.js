const Refund = require('../models/Refund');
const Payment = require('../models/Payment');

const createRefund = async (payment_id, amount, reason) => {
    try {
        // Kiểm tra payment có tồn tại không
        const payment = await Payment.findByPk(payment_id);
        if (!payment) {
            throw new Error("Payment not found");
        }

        // Kiểm tra nếu số tiền refund lớn hơn số tiền payment
        if (amount > payment.amount) {
            throw new Error("Refund amount exceeds payment amount");
        }

        // Tạo refund mới
        const refund = await Refund.create({ payment_id, amount, reason });
        return refund;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getRefundById = async (refund_id) => {
    return await Refund.findByPk(refund_id, { include: { model: Payment, as: 'payment' } });
};

const getRefundsByPayment = async (payment_id) => {
    return await Refund.findAll({ where: { payment_id }, include: { model: Payment, as: 'payment' } });
};

const updateRefundStatus = async (refund_id, status) => {
    try {
        const refund = await Refund.findByPk(refund_id);
        if (!refund) {
            throw new Error("Refund not found");
        }

        refund.status = status;
        await refund.save();
        return refund;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    createRefund,
    getRefundById,
    getRefundsByPayment,
    updateRefundStatus
};
