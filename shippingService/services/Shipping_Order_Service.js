const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: process.env.CLIENT_ID,
  brokers: [process.env.KAFKA_BROKER || "kafka:9092"],
});

const consumer = kafka.consumer({ groupId: process.env.GROUP_ID });
const producer = kafka.producer();

const listenKafka = async () => {
  try {
    await consumer.connect();
    await producer.connect();

    const topics = [
      "shipping-update-quantity",
      "shipping-create-shipment",
      "shipping-get-shipment-status",
    ];

    for (const topic of topics) {
      await consumer.subscribe({ topic, fromBeginning: false });
    }

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log(`Received message from topic: ${topic}`);
        console.log(`Message value: ${message.value.toString()}`);

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

    // Gracefully disconnect Kafka consumer and producer on process termination
    const shutdown = async () => {
      await consumer.disconnect();
      await producer.disconnect();
      process.exit(0);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("Error connecting to Kafka:", error.message);
  }
};

module.exports = { listenKafka };
