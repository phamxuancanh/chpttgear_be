const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const { v4: uuidv4 } = require('uuid');

const Shipping_Service = sequelize.define(
    'Shipping_Service',
    {
        shipping_service_id:{
            type: DataTypes.UUID,
            defaultValue: uuidv4(),
            allowNull: false,
            unique: true,
            primaryKey: true,
        },
        name:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        description:{
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null
        },
        cost:{
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        delivery_time:{
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
    },
    {
        tableName: 'shipping_services',
        timestamps: true,
        updatedAt: 'updatedAt',
        createdAt: 'createdAt'
    }
)
module.exports = Shipping_Service;
