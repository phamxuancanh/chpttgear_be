const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require("uuid");

const Transaction = sequelize.define('Transaction', {
    transaction_id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        allowNull: false,
        primaryKey: true,
    },
    payment_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'payment',
            key: 'payment_id',
        },
        onDelete: 'CASCADE',
    },
    transaction_code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED'),
        allowNull: false,
    },
    response_message: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'transaction',
    timestamps: true,
    updatedAt: 'updatedAt',
    createdAt: 'createdAt',
});

module.exports = Transaction;