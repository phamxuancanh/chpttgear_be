const initSequelize = require('../config/database');
const Payment = require('./Payment');
const Transaction = require('./Transaction');

Payment.hasMany(Transaction, { foreignKey: { name: 'payment_id', allowNull: false }, as: 'transaction' });
Transaction.belongsTo(Payment, { foreignKey: { name: 'payment_id', allowNull: false }, as: 'payment' });

module.exports = {
    initSequelize,
    models: {
        Payment,
        Transaction
    }
};