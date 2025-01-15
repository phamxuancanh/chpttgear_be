const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");
const { v4: uuidv4 } = require("uuid");

const Inventory = sequelize.define(
  "Inventory",
  {
    inventory_id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      allowNull: false,
      primaryKey: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    avarage_cost: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    quantity_in_stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "inventories",
    timestamps: true,
    updatedAt: "updatedAt",
    createdAt: "createdAt",
  }
);

module.exports = Inventory;
