const initSequelize = require('../configs/database');
const Shipping_Order_Detail = require('./Shipping_Order_Detail');
const Shipping_Address = require('./Shipping_Address');
const Shipping_Service = require('./Shipping_Service');
const Shipping_Order = require('./Shipping_Order');
//-------------------1 - n--------------------------------
Shipping_Service.hasMany(Shipping_Order, { foreignKey: { name: 'shipping_service_id', allowNull: false }, as: 'shipping_order' });
Shipping_Order.belongsTo(Shipping_Service, { foreignKey: { name: 'shipping_service_id', allowNull: false }, as: 'shipping_service' });

Shipping_Address.hasMany(Shipping_Order, { foreignKey: { name: 'shipping_address_id', allowNull: false }, as: 'shipping_order' });
Shipping_Order.belongsTo(Shipping_Address, { foreignKey: { name: 'shipping_address_id', allowNull: false }, as: 'shipping_address' });

Shipping_Order.hasMany(Shipping_Order_Detail, { foreignKey: { name: 'shipping_order_id', allowNull: false }, as: 'shipping_order_detail' });
Shipping_Order_Detail.belongsTo(Shipping_Order, { foreignKey: { name: 'shipping_order_id', allowNull: false }, as: 'shipping_order' });

module.exports = {
    initSequelize,
    models: {
        Shipping_Order_Detail,
        Shipping_Address,
        Shipping_Service,
        Shipping_Order
    },
};

