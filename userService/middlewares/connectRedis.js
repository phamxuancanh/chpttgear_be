const redis = require("redis");

console.log(process.env.REDIS_HOST, process.env.REDIS_PORT);
// Tạo client và kết nối
const client = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

// Xử lý sự kiện lỗi
client.on("error", (error) => {
  console.error("Redis Error:", error);
});

// Kết nối Redis
(async () => {
  try {
    await client.connect(); // 🔹 Quan trọng: Phải gọi connect() trước khi dùng
    console.log("✅ Redis connected");

    // Kiểm tra ping
    const pong = await client.ping();
    console.log("Redis Ping:", pong);
  } catch (error) {
    console.error("Redis Connection Error:", error);
  }
})();

// Xuất module
module.exports = client;
