const redis = require('redis');

// Tạo client và kết nối
const client = redis.createClient({
  socket: {
    host: '127.0.0.1',
    port: 6379
  }
});

// Xử lý sự kiện lỗi
client.on('error', (error) => {
  console.error('Redis Error:', error);
});

// Kết nối Redis
(async () => {
  try {
    await client.connect();  // 🔹 Quan trọng: Phải gọi connect() trước khi dùng
    console.log('✅ Redis connected');

    // Kiểm tra ping
    const pong = await client.ping();
    console.log('Redis Ping:', pong);
  } catch (error) {
    console.error('Redis Connection Error:', error);
  }
})();

// Xuất module
module.exports = client;
