const { v4: uuidv4 } = require('uuid');
const Payment = require('../models/Payment');
const Transaction = require('../models/Transaction');

exports.createPayment = async (paymentData) => {
    try {
        const newPayment = await Payment.create(paymentData);
        return newPayment;
    } catch (error) {
        throw new Error(`Lỗi khi tạo thanh toán: ${error.message}`);
    }
};

exports.getPaymentById = async (paymentId) => {
    try {
        const payment = await Payment.findByPk(paymentId, {
            include: [
                {
                    model: Transaction,
                    as: 'transaction'
                }
            ]
        });

        if (!payment) {
            throw new Error('Không tìm thấy thanh toán');
        }
        return payment;
    } catch (error) {
        throw new Error(`Lỗi khi lấy thông tin thanh toán: ${error.message}`);
    }
};

exports.getPaymentsByOrderId = async (orderId) => {
    try {
        const payments = await Payment.findAll({
            where: { order_id: orderId },
            include: [
                {
                    model: Transaction,
                    as: 'transaction'
                }
            ]
        });

        return payments;
    } catch (error) {
        throw new Error(`Lỗi khi lấy danh sách thanh toán theo đơn hàng: ${error.message}`);
    }
};
exports.updatePaymentStatus = async (paymentId, newStatus) => {
    try {
        const payment = await Payment.findByPk(paymentId);
        if (!payment) {
            throw new Error('Không tìm thấy thanh toán để cập nhật');
        }

        payment.status = newStatus;
        await payment.save();

        return payment;
    } catch (error) {
        throw new Error(`Lỗi khi cập nhật trạng thái thanh toán: ${error.message}`);
    }
};

exports.deletePayment = async (paymentId) => {
    try {
        const payment = await Payment.findByPk(paymentId);
        if (!payment) {
            throw new Error('Không tìm thấy thanh toán để xóa');
        }
        await payment.destroy();
        return { message: 'Thanh toán đã được xóa thành công' };
    } catch (error) {
        throw new Error(`Lỗi khi xóa thanh toán: ${error.message}`);
    }
};
