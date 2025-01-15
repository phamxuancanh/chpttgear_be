const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require("uuid");

const Payment = sequelize.define('Payment', {
    payment_id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        allowNull: false,
        primaryKey: true,
    },
    order_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    payment_method: {
        type: DataTypes.ENUM('COD', 'PAYPAL'),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'PAID', 'FAILED', 'CANCELLED'),
        allowNull: false,
    },
    amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
}, {
    tableName: 'payment',
    timestamps: true,
    updatedAt: 'updatedAt',
    createdAt: 'createdAt',
});

module.exports = Payment;