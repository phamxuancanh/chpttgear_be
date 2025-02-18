const { OrderItem } = require('../models');
const { Kafka } = require('kafkajs');
const dotenv = require('dotenv');

dotenv.config();

// Khởi tạo Kafka producer
const kafka = new Kafka({
    clientId: process.env.CLIENT_ID,
    brokers: [process.env.KAFKA_BROKER],
});

const producer = kafka.producer();

// Khởi tạo producer Kafka
const startKafkaProducer = async () => {
    try {
        await producer.connect();
        console.log("Kafka Producer connected successfully");
    } catch (error) {
        console.error("Error connecting to Kafka producer", error);
    }
};

startKafkaProducer(); // Kết nối producer với Kafka broker

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

        // Gửi sự kiện Kafka khi tạo order item
        await producer.send({
            topic: process.env.KAFKA_TOPIC,
            messages: [
                {
                    value: JSON.stringify({
                        eventType: 'ORDER_ITEM_CREATED',
                        orderItemData,
                        timestamp: new Date(),
                    }),
                },
            ],
        });

        console.log('Sent event ORDER_ITEM_CREATED to Kafka');
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

        // Gửi sự kiện Kafka khi cập nhật order item
        await producer.send({
            topic: process.env.KAFKA_TOPIC,
            messages: [
                {
                    value: JSON.stringify({
                        eventType: 'ORDER_ITEM_UPDATED',
                        orderItemData,
                        timestamp: new Date(),
                    }),
                },
            ],
        });

        console.log('Sent event ORDER_ITEM_UPDATED to Kafka');
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

        // Gửi sự kiện Kafka khi xóa order item
        await producer.send({
            topic: process.env.KAFKA_TOPIC,
            messages: [
                {
                    value: JSON.stringify({
                        eventType: 'ORDER_ITEM_DELETED',
                        orderItemData: orderItem,
                        timestamp: new Date(),
                    }),
                },
            ],
        });

        console.log('Sent event ORDER_ITEM_DELETED to Kafka');
        return { message: 'Mặt hàng đã được xóa thành công' };
    } catch (error) {
        throw new Error('Có lỗi xảy ra khi xóa mặt hàng trong đơn hàng');
    }
};
