const transactionService = require('../services/Transaction_Service');

exports.createTransaction = async (req, res) => {
    try {
        const { payment_id, transaction_code, status, response_message } = req.body;

        const transaction = await transactionService.createTransaction({
            payment_id,
            transaction_code,
            status,
            response_message,
        });

        res.status(201).json({
            message: 'Transaction created successfully',
            data: transaction,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getTransactionById = async (req, res) => {
    try {
        const { id } = req.params;

        const transaction = await transactionService.getTransactionById(id);

        res.status(200).json(transaction);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.getTransactionsByPaymentId = async (req, res) => {
    try {
        const { payment_id } = req.params;

        const transactions = await transactionService.getTransactionsByPaymentId(payment_id);

        res.status(200).json(transactions);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.updateTransactionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, response_message } = req.body;

        const transaction = await transactionService.updateTransactionStatus(id, {
            status,
            response_message,
        });

        res.status(200).json({
            message: 'Transaction status updated successfully',
            data: transaction,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.handlePaymentGatewayResponse = async (req, res) => {
    try {
        const { transaction_code, status, response_message } = req.body;

        const transaction = await transactionService.handlePaymentGatewayResponse({
            transaction_code,
            status,
            response_message,
        });

        res.status(200).json({
            message: 'Payment response processed successfully',
            data: transaction,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
