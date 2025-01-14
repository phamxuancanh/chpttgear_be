const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: process.env.CLIENT_ID,
  brokers: [process.env.KAFKA_BROKER || "kafka:9092"],
});

const consumer = kafka.consumer({ groupId: process.env.GROUP_ID });
const producer = kafka.producer(); // Khởi tạo producer một lần duy nhất

const listenKafka = async () => {
  try {
    // Kết nối tới Kafka broker
    await consumer.connect();
    await producer.connect(); // Kết nối producer một lần duy nhất

    // Đăng ký nhiều topic để nhận tin nhắn
    await consumer.subscribe({
      topic: "shipping-update-quantity",
      fromBeginning: false,
    });
    await consumer.subscribe({
      topic: "shipping-create-shipment",
      fromBeginning: false,
    });
    await consumer.subscribe({
      topic: "shipping-get-shipment-status",
      fromBeginning: false,
    });

    // Xử lý tin nhắn nhận được từ các topic
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log(`Received message from topic: ${topic}`);
        console.log(`Message value: ${message.value.toString()}`);

        // Xử lý các tin nhắn theo từng topic
        switch (topic) {
          case "shipping-update-quantity":
            console.log(
              "Processing shipping update quantity:",
              message.value.toString()
            );
            break;
          case "shipping-create-shipment":
            console.log(
              "Processing shipping create shipment:",
              message.value.toString()
            );
            break;
          case "shipping-get-shipment-status":
            console.log(
              "Processing shipping get shipment status:",
              message.value.toString()
            );
            break;
          default:
            console.log("Unknown topic:", topic);
        }
      },
    });
  } catch (error) {
    console.error("Error connecting to Kafka:", error.message);
  }
};

module.exports = { listenKafka };
