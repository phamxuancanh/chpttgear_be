const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const { v4: uuidv4 } = require('uuid');

const Shipping_Address = sequelize.define(
    'Shipping_Address',
    {
        shipping_address_id:{
            type: DataTypes.UUID,
            defaultValue: uuidv4(),
            allowNull: false,
            unique: true,
            primaryKey: true,
        },
        user_id:{
            type: DataTypes.UUID,
            allowNull: false,
        },
        street_address:{
            type: DataTypes.TEXT,
            allowNull: false,
        },
        city:{
            type: DataTypes.TEXT,
            allowNull: false,
        },
        state:{
            type: DataTypes.TEXT,
            allowNull: false,
        },
        country:{
            type: DataTypes.TEXT,
            allowNull: false,
        },
        postal_code:{
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        tableName: 'shipping_addresses',
        timestamps: true,
        updatedAt: 'updatedAt',
        createdAt: 'createdAt'
    }
)
module.exports = Shipping_Address;
