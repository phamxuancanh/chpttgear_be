const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 6868;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(cors({ origin: "*", credentials: true }));
require("./middlewares/proxy")(app);

app.get("/", (req, res) => {
  res.send("API Gateway đang hoạt động");
});

// Health check endpoint for debugging
app.get("/health", (req, res) => {
  res.send("API Gateway is up and running!");
});

app.listen(PORT, () => {
  console.log(`API Gateway đang chạy tại cổng ${PORT}`);
});
