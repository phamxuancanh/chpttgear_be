const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");
const { v4: uuidv4 } = require("uuid");

const Shipping_Order = sequelize.define(
  "Shipping_Order",
  {
    shipping_order_id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4(),
      allowNull: false,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("CONFIRMED", "SHIPPED", "RECEIVED", "RATING"),
      allowNull: false,
      defaultValue: "CONFIRMED",
    },
    shipping_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date().toISOString(),
    },
    estimated_delivery_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.ENUM("COD", "PAYPAL"),
      allowNull: false,
      defaultValue: "COD",
    },
    full_address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    required_note: {
      type: DataTypes.ENUM(
        "CHOTHUHANG",
        "CHOXEMHANGKHONGTHU",
        "KHONGCHOXEMHANG"
      ),
      allowNull: false,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    order_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    total_fee: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "shipping_orders",
    timestamps: true,
    updatedAt: "updatedAt",
    createdAt: "createdAt",
  }
);

module.exports = Shipping_Order;
