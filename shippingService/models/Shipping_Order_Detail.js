const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const { v4: uuidv4 } = require('uuid');

const Shipping_Order = sequelize.define(
    'Shipping_Order',
    {
        shipping_order_id: {
            type: DataTypes.UUID,
            defaultValue: uuidv4,
            allowNull: false,
            primaryKey: true,
        },
        order_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("PENDING",'CONFIRMED','PROCESSING','ON_HOLD','CANCELLED','REFUNDED','FAILED'),
            allowNull: false,
            defaultValue:'PENDING'
        },
        shipping_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: new Date().toISOString()
        },
        estimated_delivery_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        shipping_service_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'shipping_services',
                key: 'shipping_service_id',
            },
        },
        shipping_address_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'shipping_addresses',
                key: 'shipping_address_id',
            },
        },
    },
    {
        tableName: 'shipping_orders',
        timestamps: true,
        updatedAt: 'updatedAt',
        createdAt: 'createdAt'
    }
);

module.exports = Shipping_Order;
