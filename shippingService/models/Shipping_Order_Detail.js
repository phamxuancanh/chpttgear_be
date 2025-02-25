const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");
const { v4: uuidv4 } = require("uuid");

const Shipping_Order_Detail = sequelize.define(
  "Shipping_Order_Detail",
  {
    shipping_order_detail_id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4(),
      allowNull: false,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    shipping_order_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "shipping_orders",
        key: "shipping_order_id",
      },
    },
  },
  {
    tableName: "shipping_order_details",
    timestamps: true,
    updatedAt: "updatedAt",
    createdAt: "createdAt",
  }
);

module.exports = Shipping_Order_Detail;
