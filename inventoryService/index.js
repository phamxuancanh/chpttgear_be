require("dotenv").config();
const express = require("express");
const { initSequelize } = require("./models");
const cors = require("cors");
const bodyParser = require("body-parser");
const inventoryRoute = require("./routes/Inventory_Route");
const stockInRoutes = require("./routes/Stock_In_Route");
const stockOutRoutes = require("./routes/Stock_Out_Route");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "https://chpttgear-fe.vercel.app/",
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://chpttgear-fe.vercel.app/");
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
// Routes
app.use("/api/v1/inventory", inventoryRoute);
app.use("/api/v1/inventory/stock-in", stockInRoutes);
app.use("/api/v1/inventory/stock-out", stockOutRoutes);

// Khởi tạo cơ sở dữ liệu và bắt đầu server
async function main() {
  try {
    // await initSequelize.sync({ force: true }); // Nếu cần đồng bộ lại cơ sở dữ liệu
    // console.log("Database and tables synchronized!");

    app.listen(process.env.PORT || 2222, () => {
      // Thay app.listen thành server.listen
      console.log("Server is running on port", process.env.PORT || 5000);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
