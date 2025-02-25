const Order = require("../models/Orders");
const { Kafka } = require('kafkajs');
const dotenv = require('dotenv');
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");
const OrderItem = require("../models/Order_Item");


// dotenv.config();

// const kafka = new Kafka({
//   clientId: process.env.CLIENT_ID,
//   brokers: [process.env.KAFKA_BROKER],
// });

// const producer = kafka.producer();

// // Khởi tạo producer Kafka
// const startKafkaProducer = async () => {
//   try {
//     await producer.connect();
//     console.log("Kafka Producer connected successfully");
//   } catch (error) {
//     console.error("Error connecting to Kafka producer", error);
//   }
// };

// startKafkaProducer();  // Gọi hàm để kết nối producer với Kafka broker

// Get all orders
exports.getAllOrders = async () => {
  try {
    const orders = await Order.findAll();
    return orders;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    throw new Error(error.message);
  }
};


// Get order by ID
exports.getOrderById = async (orderId) => {
  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    return order;
  } catch (error) {
    throw new Error("Error fetching order");
  }
};

exports.getOrdersByUserId = async (userId) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: userId },
      include: [
        {
          model: OrderItem,
          as: "order_item",
        },
      ],
    });

    return orders;
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách đơn hàng: " + error.message);
  }
};

// Create a new order
exports.createOrder = async (orderData) => {
  try {
    const order = await Order.create(orderData);

    // Gửi sự kiện Kafka khi tạo đơn hàng
    // await producer.send({
    //   topic: process.env.KAFKA_TOPIC,
    //   messages: [
    //     {
    //       value: JSON.stringify({
    //         eventType: 'ORDER_CREATED',
    //         orderData,
    //         timestamp: new Date(),
    //       }),
    //     },
    //   ],
    // });

    // console.log(`Sent event ORDER_CREATED to Kafka`);
    return order;
  } catch (error) {
    throw new Error("Error creating order");
  }
};

// Update an existing order
exports.updateOrder = async (orderId, orderData) => {
  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    await order.update(orderData);

    // Gửi sự kiện Kafka khi cập nhật đơn hàng
    // await producer.send({
    //   topic: process.env.KAFKA_TOPIC,
    //   messages: [
    //     {
    //       value: JSON.stringify({
    //         eventType: 'ORDER_UPDATED',
    //         orderData,
    //         timestamp: new Date(),
    //       }),
    //     },
    //   ],
    // });

    // console.log(`Sent event ORDER_UPDATED to Kafka`);
    return order;
  } catch (error) {
    throw new Error("Error updating order");
  }
};

// Delete an order
exports.deleteOrder = async (orderId) => {
  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    await order.destroy();

    // Gửi sự kiện Kafka khi xóa đơn hàng
    // await producer.send({
    //   topic: process.env.KAFKA_TOPIC,
    //   messages: [
    //     {
    //       value: JSON.stringify({
    //         eventType: 'ORDER_DELETED',
    //         orderData: order,
    //         timestamp: new Date(),
    //       }),
    //     },
    //   ],
    // });

    // console.log(`Sent event ORDER_DELETED to Kafka`);
    // return { message: "Order deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting order");
  }
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendEmail = async (to, subject, templateName, context) => {
  const filePath = path.join(__dirname, templateName);
  const source = fs.readFileSync(filePath, 'utf-8');
  const template = handlebars.compile(source);
  const html = template(context);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};
