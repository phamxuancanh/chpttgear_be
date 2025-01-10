const { OrderItem } = require('../models');

// Lấy tất cả các order item trong đơn hàng
exports.getAllOrderItemsByOrderId = async (orderId) => {
    try {
        const orderItems = await OrderItem.findAll({
            where: { order_id: orderId }
        });
        return orderItems;
    } catch (error) {
        throw new Error('Có lỗi xảy ra khi lấy danh sách mặt hàng trong đơn hàng');
    }
};

// Lấy thông tin order item theo ID
exports.getOrderItemById = async (orderItemId) => {
    try {
        const orderItem = await OrderItem.findByPk(orderItemId);
        if (!orderItem) {
            throw new Error('Không tìm thấy mặt hàng trong đơn hàng');
        }
        return orderItem;
    } catch (error) {
        throw new Error('Có lỗi xảy ra khi lấy thông tin mặt hàng');
    }
};

// Tạo một order item mới
exports.createOrderItem = async (orderItemData) => {
    try {
        const orderItem = await OrderItem.create(orderItemData);
        return orderItem;
    } catch (error) {
        throw new Error('Có lỗi xảy ra khi tạo mặt hàng trong đơn hàng');
    }
};

// Cập nhật thông tin order item
exports.updateOrderItem = async (orderItemId, orderItemData) => {
    try {
        const orderItem = await OrderItem.findByPk(orderItemId);
        if (!orderItem) {
            throw new Error('Không tìm thấy mặt hàng để cập nhật');
        }
        await orderItem.update(orderItemData);
        return orderItem;
    } catch (error) {
        throw new Error('Có lỗi xảy ra khi cập nhật mặt hàng trong đơn hàng');
    }
};

// Xóa order item
exports.deleteOrderItem = async (orderItemId) => {
    try {
        const orderItem = await OrderItem.findByPk(orderItemId);
        if (!orderItem) {
            throw new Error('Không tìm thấy mặt hàng để xóa');
        }
        await orderItem.destroy();
        return { message: 'Mặt hàng đã được xóa thành công' };
    } catch (error) {
        throw new Error('Có lỗi xảy ra khi xóa mặt hàng trong đơn hàng');
    }
};