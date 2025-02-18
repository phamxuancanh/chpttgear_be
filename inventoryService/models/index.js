const initSequelize = require("../configs/database");
const Inventory = require("./Inventory");
const Stock_In = require("./Stock_In");
const Stock_Out = require("./Stock_Out");
//-------------------1 - n--------------------------------
Inventory.hasMany(Stock_In, {
  foreignKey: { name: "inventory_id", allowNull: false },
  as: "stock_in",
});
Stock_In.belongsTo(Inventory, {
  foreignKey: { name: "inventory_id", allowNull: false },
  as: "inventory",
});

Inventory.hasMany(Stock_Out, {
  foreignKey: { name: "inventory_id", allowNull: false },
  as: "stock_out",
});
Stock_Out.belongsTo(Inventory, {
  foreignKey: { name: "inventory_id", allowNull: false },
  as: "inventory",
});
module.exports = {
  initSequelize,
  models: {
    Inventory,
    Stock_In,
    Stock_Out,
  },
};
