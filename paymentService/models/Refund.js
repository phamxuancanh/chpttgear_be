const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require("uuid");

const Refund = sequelize.define('Refund', {
    refund_id: {
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
    amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0.0,
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM("PENDING", "PROCESSED", "FAILED"),
        defaultValue: "PENDING"
    },
}, {
    tableName: 'refund',
    timestamps: true,
    updatedAt: 'updatedAt',
    createdAt: 'createdAt',
});
module.exports = Refund;