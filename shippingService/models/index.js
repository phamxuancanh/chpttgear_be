const initSequelize = require("../configs/database");
const Shipping_Order_Detail = require("./Shipping_Order_Detail");
const Shipping_Order = require("./Shipping_Order");
//-------------------1 - n--------------------------------

Shipping_Order.hasMany(Shipping_Order_Detail, {
  foreignKey: { name: "shipping_order_id", allowNull: false },
  as: "shipping_order_detail",
});
Shipping_Order_Detail.belongsTo(Shipping_Order, {
  foreignKey: { name: "shipping_order_id", allowNull: false },
  as: "shipping_order",
});

module.exports = {
  initSequelize,
  models: {
    Shipping_Order_Detail,
    Shipping_Order,
  },
};
