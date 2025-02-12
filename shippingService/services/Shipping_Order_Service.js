const { Kafka } = require("kafkajs");

// const kafka = new Kafka({
//   clientId: "user-consumer",
//   brokers: ["kafka.ntt1102.xyz:9092"],
// });
const kafka = new Kafka({
  clientId: process.env.CLIENT_ID || "chptt_gear",
  brokers: [process.env.KAFKA_BROKER || "kafka:9092"],
});

const consumer = kafka.consumer({
  groupId: process.env.GROUP_ID || "chptt_gear",
});

const run = async () => {
  console.log("test :" + process.env.KAFKA_BROKER);
  await consumer.connect();
  const topics = [
    "shipping-update-quantity",
    "shipping-create-shipment",
    "shipping-get-shipment-status",
  ];

  for (const topic of topics) {
    await consumer.subscribe({
      topic: topic,
      fromBeginning: false,
    }); // Set fromBeginning to false to only receive new messages
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

      // Commit the offset to mark the message as processed
      await consumer.commitOffsets([
        { topic, partition, offset: message.offset },
      ]);
    },
  });
};

module.exports = { run };
