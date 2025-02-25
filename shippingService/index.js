require("dotenv").config();
const express = require("express");
const { initSequelize } = require("./models");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const shippingOrderRoutes = require("./routes/Shipping_Order_Route");
// const { run } = require("./services/Shipping_Order_Service");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware
app.use(express.json());
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

app.use("/api/v1/shipping-orders", shippingOrderRoutes);
// Routes
// run().catch(console.error);
// Khởi tạo cơ sở dữ liệu và bắt đầu server
async function main() {
  try {
    // await initSequelize.sync({ force: true }); // Nếu cần đồng bộ lại cơ sở dữ liệu
    // console.log("Database and tables synchronized!");

    app.listen(process.env.PORT || 2223, () => {
      // Thay app.listen thành server.listen
      console.log("Server is running on port", process.env.PORT || 2223);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
