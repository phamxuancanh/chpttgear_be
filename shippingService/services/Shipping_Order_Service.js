// const { Kafka } = require("kafkajs");

// // const kafka = new Kafka({
// //   clientId: "user-consumer",
// //   brokers: ["kafka.ntt1102.xyz:9092"],
// // });
// const kafka = new Kafka({
//   clientId: process.env.CLIENT_ID || "chptt_gear",
//   brokers: [process.env.KAFKA_BROKER || "kafka:9092"],
// });

// const consumer = kafka.consumer({
//   groupId: process.env.GROUP_ID || "chptt_gear",
// });

// const run = async () => {
//   console.log("test :" + process.env.KAFKA_BROKER);
//   await consumer.connect();
//   const topics = [
//     "shipping-update-quantity",
//     "shipping-create-shipment",
//     "shipping-get-shipment-status",
//   ];

//   for (const topic of topics) {
//     await consumer.subscribe({
//       topic: topic,
//       fromBeginning: false,
//     }); // Set fromBeginning to false to only receive new messages
//   }

//   await consumer.run({
//     eachMessage: async ({ topic, partition, message }) => {
//       console.log(`Received message from topic: ${topic}`);
//       console.log(`Message value: ${message.value.toString()}`);
//       switch (topic) {
//         case "shipping-update-quantity":
//           console.log(
//             "Processing shipping update quantity:",
//             message.value.toString()
//           );
//           break;
//         case "shipping-create-shipment":
//           console.log(
//             "Processing shipping create shipment:",
//             message.value.toString()
//           );
//           break;
//         case "shipping-get-shipment-status":
//           console.log(
//             "Processing shipping get shipment status:",
//             message.value.toString()
//           );
//           break;
//         default:
//           console.log("Unknown topic:", topic);
//       }

//       // Commit the offset to mark the message as processed
//       await consumer.commitOffsets([
//         { topic, partition, offset: message.offset },
//       ]);
//     },
//   });
// };

// module.exports = { run };

const { default: axios } = require("axios");
const ShippingOrder = require("../models/Shipping_Order");
const ShippingOrderDetail = require("../models/Shipping_Order_Detail");
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

const getAllOrders = async () => {
  try {
    const orders = await ShippingOrder.findAll({
      include: [
        {
          model: ShippingOrderDetail, // Bao gồm chi tiết đơn hàng
          as: "shipping_order_detail", // Nếu có alias trong association, cần đặt đúng tên
        },
      ],
    });

    return orders;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    throw new Error("Không thể lấy danh sách đơn hàng");
  }
};

const createOrder = async (orderData) => {
  console.log("service");
  console.log("-----------------------------");
  console.log(orderData.items);

  try {
    // Tạo ID cho đơn hàng
    const shipping_order_id = uuidv4();

    // Tạo đơn hàng
    const newOrder = await ShippingOrder.create({
      shipping_order_id: shipping_order_id,
      order_id: orderData.order_id,
      user_id: orderData.user_id,
      estimated_delivery_date: orderData.estimated_delivery_date,
      weight: orderData.weight,
      total_price: orderData.total_price,
      payment_method: orderData.payment_method,
      full_address: orderData.full_address,
      provinceCode: orderData.provinceCode,
      districtCode: orderData.districtCode,
      wardCode: orderData.wardCode,
    });

    console.log("Đã tạo đơn hàng:", newOrder);

    // Nếu có danh sách sản phẩm thì tạo từng ShippingOrderDetail riêng lẻ
    if (orderData.items && orderData.items.length > 0) {
      for (const item of orderData.items) {
        const newDetail = await ShippingOrderDetail.create({
          shipping_order_detail_id: uuidv4(), // Tạo ID duy nhất
          shipping_order_id: shipping_order_id, // Liên kết với đơn hàng cha
          product_id: item.product_id,
          quantity: item.quantity,
          weight: item.weight,
        });
        console.log("Đã tạo chi tiết đơn hàng:", newDetail);
      }
    }

    return newOrder;
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error);
    throw new Error("Lỗi khi tạo đơn hàng");
  }
};

const getOrdersByUserId = async (user_id) => {
  return await ShippingOrder.findAll({
    where: { user_id },
    include: ShippingOrderDetail,
  });
};
const getOrderByOrderId = async (order_id) => {
  try {
    const order = await ShippingOrder.findOne({
      where: { order_id },
      include: [
        {
          model: ShippingOrderDetail,
          as: "orderDetails", // Chú ý alias nếu có
        },
      ],
    });

    if (!order) {
      throw new Error("Không tìm thấy đơn hàng với order_id này");
    }

    return order;
  } catch (error) {
    console.error("Lỗi khi lấy đơn hàng theo order_id:", error);
    throw new Error("Không thể lấy đơn hàng");
  }
};
const calculateShippingFee = async (toDistrict, toWard, weight, ShopId) => {
  try {
    const response = await axios.post(
      "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
      {
        service_type_id: 2,
        to_district_id: toDistrict,
        to_ward_code: toWard,
        weight: weight,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Token: "aa43f060-d157-11ef-b2e4-6ec7c647cc27",
          ShopId: ShopId,
        },
      }
    );
    console.log(response.data);
    return response.data?.data?.total || 0;
  } catch (error) {
    console.error(
      "Error calculating shipping fee:",
      error.response?.data || error.message
    );
    throw new Error("Failed to calculate shipping fee");
  }
};

module.exports = {
  getAllOrders,
  createOrder,
  getOrdersByUserId,
  getOrderByOrderId,
  calculateShippingFee,
};
