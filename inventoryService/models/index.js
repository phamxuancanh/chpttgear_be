const initSequelize = require('../configs/database');
const Inventory = require('./Inventory');
const Purchase_Order = require('./Purchase_Order');
const Purchase_Order_Detail = require('./Purchase_Order_Detail');
//-------------------1 - n--------------------------------
Inventory.hasMany(Purchase_Order, { foreignKey: { name: 'inventory_id', allowNull: false }, as: 'purchase_order' });
Purchase_Order.belongsTo(Purchase_Order, { foreignKey: { name: 'inventory_id', allowNull: false }, as: 'inventory' });

Purchase_Order.hasMany(Purchase_Order_Detail, { foreignKey: { name: 'purchase_order_id', allowNull: false }, as: 'purchase_order_detail' });
Purchase_Order_Detail.belongsTo(Purchase_Order, { foreignKey: { name: 'purchase_order_id', allowNull: false }, as: 'purchase_order' });

module.exports = {
    initSequelize,
    models: {
        Inventory,
        Purchase_Order,
        Purchase_Order_Detail
    },
};

