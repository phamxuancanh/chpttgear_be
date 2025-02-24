const { v4: uuidv4 } = require('uuid');
const Payment = require('../models/Payment');

// Lấy thông tin payment theo payment_id
exports.getPaymentById = async (paymentId) => {
    try {
        const payment = await Payment.findByPk(paymentId);
        if (!payment) {
            throw new Error('Không tìm thấy thanh toán');
        }
        return payment;
    } catch (error) {
        throw new Error('Có lỗi xảy ra khi lấy thông tin thanh toán');
    }
};

// Lấy danh sách thanh toán theo order_id
exports.getPaymentsByOrderId = async (orderId) => {
    try {
        const payments = await Payment.findAll({
            where: { order_id: orderId }
        });
        return payments;
    } catch (error) {
        throw new Error('Có lỗi xảy ra khi lấy thanh toán theo đơn hàng');
    }
};

exports.createPayment = async (paymentData) => {
    try {
        if (paymentData.payment_method === 'COD') {
            const payment = await Payment.create({
                ...paymentData,
                status: 'PENDING',
            });
            return payment;
        }

        if (paymentData.payment_method === 'PAYPAL') {
            const clientId = process.env.PAYPAL_CLIENT_ID;
            const secret = process.env.PAYPAL_CLIENT_SECRET;
            const auth = Buffer.from(`${clientId}:${secret}`).toString('base64');

            const tokenResponse = await axios.post(
                'https://api-m.sandbox.paypal.com/v1/oauth2/token',
                qs.stringify({ grant_type: 'client_credentials' }),
                {
                    headers: {
                        Authorization: `Basic ${auth}`,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            const accessToken = tokenResponse.data.access_token;
            const paymentResponse = await axios.post(
                'https://api-m.sandbox.paypal.com/v1/payments/payment',
                {
                    intent: 'sale',
                    payer: {
                        payment_method: 'paypal',
                    },
                    transactions: [
                        {
                            amount: {
                                total: paymentData.amount.toFixed(2),
                                currency: 'USD',
                            },
                            description: `Payment for order ${paymentData.order_id}`,
                        },
                    ],
                    redirect_urls: {
                        return_url: `${process.env.CLIENT_HOST}/paypal/success?orderId=${paymentData.order_id}`,
                        cancel_url: `${process.env.CLIENT_HOST}/paypal/cancel?orderId=${paymentData.order_id}`,
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const payment = await Payment.create({
                ...paymentData,
                status: 'PENDING',
            });

            await Transaction.create({
                payment_id: payment.payment_id,
                transaction_code: paymentResponse.data.id,
                status: 'PENDING',
            });

            const approvalUrl = paymentResponse.data.links.find(
                (link) => link.rel === 'approval_url'
            ).href;

            return { payment, approvalUrl };
        }

        throw new Error('Invalid payment method');
    } catch (error) {
        console.error('Error in createPayment:', error.message);
        throw error;
    }
};

exports.handlePaypalSuccess = async (paymentId, payerId) => {
    try {
        const clientId = process.env.PAYPAL_CLIENT_ID;
        const secret = process.env.PAYPAL_CLIENT_SECRET;
        const auth = Buffer.from(`${clientId}:${secret}`).toString('base64');

        const executeResponse = await axios.post(
            `https://api-m.sandbox.paypal.com/v1/payments/payment/${paymentId}/execute`,
            { payer_id: payerId },
            {
                headers: {
                    Authorization: `Basic ${auth}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const orderId = executeResponse.data.transactions[0].description.split(' ')[2];
        const payment = await Payment.findOne({
            where: { order_id: orderId },
        });

        if (!payment) throw new Error('Payment not found');

        payment.status = 'PAID';
        await payment.save();

        await Transaction.update(
            { status: 'SUCCESS', response_message: 'Payment completed successfully' },
            { where: { transaction_code: paymentId } }
        );

        return payment;
    } catch (error) {
        console.error('Error in handlePaypalSuccess:', error.message);
        throw error;
    }
};

exports.handlePaypalCancel = async (orderId) => {
    try {
        const payment = await Payment.findOne({
            where: { order_id: orderId, status: 'PENDING' },
        });

        if (!payment) throw new Error('Payment not found');

        payment.status = 'CANCELLED';
        await payment.save();

        await Transaction.update(
            { status: 'CANCELLED', response_message: 'Payment was cancelled by user' },
            { where: { payment_id: payment.payment_id } }
        );

        return payment;
    } catch (error) {
        console.error('Error in handlePaypalCancel:', error.message);
        throw error;
    }
};

// Cập nhật thông tin payment
exports.updatePayment = async (paymentId, paymentData) => {
    try {
        const payment = await Payment.findByPk(paymentId);
        if (!payment) {
            throw new Error('Không tìm thấy thanh toán để cập nhật');
        }

        // Cập nhật trạng thái thanh toán sau khi xác nhận (ví dụ: khi thanh toán PayPal hoàn tất)
        if (paymentData.status === 'COMPLETED') {
            if (paymentData.payment_method === 'PAYPAL')
                // Thực hiện logic cập nhật khi thanh toán PayPal hoàn tất
                await payment.update(paymentData);
        } else if (paymentData.status === 'CANCELLED' && paymentData.payment_method === 'COD') {
            // Cập nhật nếu thanh toán bị hủy (COD)
            await payment.update(paymentData);
        }

        return payment;
    } catch (error) {
        throw new Error('Có lỗi xảy ra khi cập nhật thanh toán');
    }
};

// Xóa payment
exports.deletePayment = async (paymentId) => {
    try {
        const payment = await Payment.findByPk(paymentId);
        if (!payment) {
            throw new Error('Không tìm thấy thanh toán để xóa');
        }
        await payment.destroy();
        return { message: 'Thanh toán đã được xóa thành công' };
    } catch (error) {
        throw new Error('Có lỗi xảy ra khi xóa thanh toán');
    }
};