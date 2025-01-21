const Order = require('../models/Order');

// Get all orders
exports.getAllOrders = async () => {
    try {
        const orders = await Order.findAll();
        return orders;
    } catch (error) {
        throw new Error('Error fetching orders');
    }
};

// Get order by ID
exports.getOrderById = async (orderId) => {
    try {
        const order = await Order.findByPk(orderId);
        if (!order) {
            throw new Error('Order not found');
        }
        return order;
    } catch (error) {
        throw new Error('Error fetching order');
    }
};

// Get orders by user ID
exports.getOrderByUserId = async (userId) => {
    try {
        const orders = await Order.findAll({
            where: { user_id: userId }
        });
        return orders;
    } catch (error) {
        throw new Error('Error fetching orders for user');
    }
};

exports.createOrder = async (orderData) => {
    try {
        const order = await Order.create(orderData);
        return order;
    } catch (error) {
        return { error: error.message };
    }
};


// Update an existing order
exports.updateOrder = async (orderId, orderData) => {
    try {
        const order = await Order.findByPk(orderId);
        if (!order) {
            throw new Error('Order not found');
        }
        await order.update(orderData);
        return order;
    } catch (error) {
        throw new Error('Error updating order');
    }
};

// Delete an order
exports.deleteOrder = async (orderId) => {
    try {
        const order = await Order.findByPk(orderId);
        if (!order) {
            throw new Error('Order not found');
        }
        await order.destroy();
        return { message: 'Order deleted successfully' };
    } catch (error) {
        throw new Error('Error deleting order');
    }
};
