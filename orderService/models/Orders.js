const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require("uuid");

const Order = sequelize.define(
    "Order",
    {
        order_id: {
            type: DataTypes.UUID,
            defaultValue: uuidv4,
            allowNull: false,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"),
            allowNull: false,
            defaultValue: "PENDING",
        },
        payment_method: {
            type: DataTypes.ENUM("PAYPAL", "COD"),
            allowNull: false,
            defaultValue: "COD",
        },
        total_amount: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            defaultValue: 0.0,
        },
        shipping_amount: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            defaultValue: 0.0,
        },
        provinceCode: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        districtCode: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        wardCode: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        houseNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        tableName: "orders",
        timestamps: true,
        updatedAt: "updatedAt",
        createdAt: "createdAt",
    }
);

module.exports = Order;
