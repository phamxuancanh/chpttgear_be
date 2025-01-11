const Transaction = require('../models/Transaction');
const Payment = require('../models/Payment');
const { v4: uuidv4 } = require('uuid');

exports.createTransaction = async ({ payment_id, transaction_code, status, response_message }) => {
    try {
        const paymentExists = await Payment.findByPk(payment_id);
        if (!paymentExists) {
            throw new Error('Payment not found');
        }

        const transaction = await Transaction.create({
            transaction_id: uuidv4(),
            payment_id,
            transaction_code,
            status,
            response_message,
        });

        return transaction;
    } catch (error) {
        throw new Error(`Failed to create transaction: ${error.message}`);
    }
};

exports.getTransactionById = async (transaction_id) => {
    try {
        const transaction = await Transaction.findByPk(transaction_id);
        if (!transaction) {
            throw new Error('Transaction not found');
        }
        return transaction;
    } catch (error) {
        throw new Error(`Failed to retrieve transaction: ${error.message}`);
    }
};

exports.getTransactionsByPaymentId = async (payment_id) => {
    try {
        const transactions = await Transaction.findAll({ where: { payment_id } });
        return transactions;
    } catch (error) {
        throw new Error(`Failed to retrieve transactions: ${error.message}`);
    }
};

exports.updateTransactionStatus = async (transaction_id, { status, response_message }) => {
    try {
        const transaction = await Transaction.findByPk(transaction_id);
        if (!transaction) {
            throw new Error('Transaction not found');
        }

        transaction.status = status;
        transaction.response_message = response_message;
        await transaction.save();

        return transaction;
    } catch (error) {
        throw new Error(`Failed to update transaction: ${error.message}`);
    }
};

exports.handlePaymentGatewayResponse = async ({ transaction_code, status, response_message }) => {
    try {
        const transaction = await Transaction.findOne({ where: { transaction_code } });
        if (!transaction) {
            throw new Error('Transaction not found');
        }

        transaction.status = status;
        transaction.response_message = response_message;
        await transaction.save();

        return transaction;
    } catch (error) {
        throw new Error(`Failed to handle payment response: ${error.message}`);
    }
};
