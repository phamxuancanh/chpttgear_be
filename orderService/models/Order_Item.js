const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require("uuid");

const OrderItem = sequelize.define('OrderItem', {
    order_item_id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        allowNull: false,
        primaryKey: true,
    },
    order_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "order",
            key: 'order_id',
        },
        onDelete: 'CASCADE',
    },
    product_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 1.0
    },
    profit: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0.0,
    },
}, {
    tableName: 'order_item',
    timestamps: true,
    updatedAt: "updatedAt",
    createdAt: "createdAt",
});

module.exports = OrderItem;
