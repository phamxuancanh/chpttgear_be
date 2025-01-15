const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const { v4: uuidv4 } = require('uuid');

const Purchase_Order = sequelize.define(
    'Purchase_Order',
    {
        purchase_order_id:{
            type: DataTypes.UUID,
            defaultValue: uuidv4(),
            allowNull: false,
            unique: true,
            primaryKey: true,
        },
        supplier_name:{
            type: DataTypes.STRING,
            allowNull: true,
            unique:false,
            defaultValue: null
        },
        order_date:{
            type: DataTypes.DATE,
            allowNull: false,
            unique:true,
            defaultValue: new Date().toISOString()
        },
        status:{
            type: DataTypes.ENUM('PENDING','COMPLETE','CANCELLED'),
            allowNull: false,
            defaultValue: 'COMPLETE'
        },
        total_amount:{
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        inventory_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'inventories',
                key: 'inventory_id',
            },
        },

    },
    {
        tableName: 'purchase_orders',
        timestamps: true,
        updatedAt: 'updatedAt',
        createdAt: 'createdAt'
    }
)
module.exports = Purchase_Order;
