const initSequelize = require('../config/database');
const Payment = require('./Payment');
const Refund = require('./Refund');
const Transaction = require('./Transaction');

Payment.hasMany(Transaction, { foreignKey: { name: 'payment_id', allowNull: false }, as: 'transaction', onDelete: 'CASCADE', });
Transaction.belongsTo(Payment, { foreignKey: { name: 'payment_id', allowNull: false }, as: 'payment' });

Payment.hasOne(Refund, { foreignKey: { name: 'payment_id', allowNull: false }, as: 'refund', onDelete: 'CASCADE' });
Refund.belongsTo(Payment, { foreignKey: { name: 'payment_id', allowNull: false }, as: 'payment' });

module.exports = {
    initSequelize,
    models: {
        Payment,
        Transaction,
        Refund
    }
};