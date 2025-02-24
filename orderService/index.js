require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3333;
const { initSequelize } = require("./models");
const http = require("http");
const OrderRoute = require("./routes/Order_Route");
const OrderItemRoute = require("./routes/Order_Item_Route");

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware cho CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to Order Services!");
});

app.use("/api/v1/orders", OrderRoute);
app.use("/api/v1/orders/order-items", OrderItemRoute);

// Khởi tạo cơ sở dữ liệu và bắt đầu server
async function main() {
  try {
    // await initSequelize.sync({ force: true }); // Nếu cần đồng bộ lại cơ sở dữ liệu
    // console.log("Database and tables synchronized!");

    server.listen(PORT, () => {
      console.log("Server is running on port", PORT);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}
main();
