const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");
const { v4: uuidv4 } = require("uuid");

const Stock_Out = sequelize.define(
  "Stock_Out",
  {
    stock_out_id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4(),
      allowNull: false,
      unique: true,
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
    order_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    inventory_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "inventories",
        key: "inventory_id",
      },
    },
  },
  {
    tableName: "stock_outs",
    timestamps: true,
    updatedAt: "updatedAt",
    createdAt: "createdAt",
  }
);
module.exports = Stock_Out;
