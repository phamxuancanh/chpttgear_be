const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");
const { v4: uuidv4 } = require("uuid");

const Stock_In = sequelize.define(
  "Stock_In",
  {
    stock_id: {
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
    price: {
      type: DataTypes.DOUBLE,
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
    tableName: "Stock_Ins",
    timestamps: true,
    updatedAt: "updatedAt",
    createdAt: "createdAt",
  }
);
module.exports = Stock_In;
