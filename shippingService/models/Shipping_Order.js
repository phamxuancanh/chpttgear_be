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
      type: DataTypes.ENUM(
        "PENDING",
        "CONFIRMED",
        "PROCESSING",
        "ON_HOLD",
        "CANCELLED",
        "REFUNDED",
        "FAILED"
      ),
      allowNull: false,
      defaultValue: "PENDING",
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
  },
  {
    tableName: "shipping_orders",
    timestamps: true,
    updatedAt: "updatedAt",
    createdAt: "createdAt",
  }
);

module.exports = Shipping_Order;
