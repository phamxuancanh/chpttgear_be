const initSequelize = require('../config/database');
const OrderItem = require('./Order_Item');
const Order = require('./Order');

Order.hasMany(OrderItem, { foreignKey: { name: 'order_id', allowNull: false }, as: 'order_item' });
OrderItem.belongsTo(Order, { foreignKey: { name: 'order_id', allowNull: false }, as: 'order' });

module.exports = {
    initSequelize,
    models: {
        Order,
        OrderItem
    }
};