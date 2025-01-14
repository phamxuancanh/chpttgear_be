const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const { v4: uuidv4 } = require('uuid');

const Purchase_Order_Detail = sequelize.define(
    'Purchase_Order_Detail',
    {
        purchase_order_detail_id:{
            type: DataTypes.UUID,
            defaultValue: uuidv4(),
            allowNull: false,
            unique: true,
            primaryKey: true,
        },
        product_id:{
            type: DataTypes.UUID,
            allowNull: false,
        },
        quantity:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        price:{
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        purchase_order_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'purchase_orders',
                key: 'purchase_order_id',
            },
        },
    },
    {
        tableName: 'purchase_order_details',
        timestamps: true,
        updatedAt: 'updatedAt',
        createdAt: 'createdAt'
    }
)
module.exports = Purchase_Order_Detail;
