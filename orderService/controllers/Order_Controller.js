const orderService = require("../services/Order_Service");
const axios = require("axios");
const Order = require("../models/Orders");
const qs = require("qs");
require("dotenv").config();
const xml2js = require("xml2js");

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const ordersData = await orderService.getAllOrders(page, pageSize);

    return res.status(200).json(ordersData);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    return res.status(500).json({ message: "Lỗi khi lấy danh sách đơn hàng" });
  }
};

exports.getAllOrderWithNoPaging = async (req, res) => {
  try {
    const orders = await orderService.getAllOrderWithNoPaging();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json(error.message);
  }
};


// Get order by ID
exports.getOrderById = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await orderService.getOrderById(orderId);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get orders by user ID with pagination
exports.getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page, limit } = req.query; // Lấy page và limit từ query params

    // Chuyển đổi page và limit thành số nguyên
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
      return res.status(400).json({ message: "Page và Limit phải là số nguyên dương!" });
    }

    const result = await orderService.getOrdersByUserId(userId, pageNumber, limitNumber);

    if (result.orders.length === 0) {
      return res.status(404).json({ message: "Không có đơn hàng nào!" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.createOrder = async (req, res) => {
  const orderData = req.body;

  try {
    let result;
    // let approvalUrl; 

    // if (orderData.payment_method === "PAYPAL" ) {
    //   result = await orderService.createOrder(orderData);
    //   orderData.order_id = result.order_id;
    //   approvalUrl = await this.createPaypalDeposit(orderData);
    // } else if (orderData.payment_method === "COD") {
    //   result = await orderService.createOrder(orderData);
    // } else {
    //   return res.status(400).json({ error: "Invalid payment method" });
    // }
    result = await orderService.createOrder(orderData);
    const response = { order: result };
    // if (approvalUrl) response.approvalUrl = approvalUrl;

    res.status(201).json(response);
  } catch (error) {
    const message =
      error?.response?.data?.message || error?.response?.data || error?.message || "Lỗi không xác định";
    console.error("❌ Lỗi trong createOrder:", message);
    res.status(500).json({ error: message });
  }
};

// Update an existing order
exports.updateOrder = async (req, res) => {
  const { orderId } = req.params;
  const orderData = req.body;
  try {
    const updatedOrder = await orderService.updateOrder(orderId, orderData);
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    const result = await orderService.deleteOrder(orderId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getShippingFee = async (req, res) => {
  try {
    const params = req.body;
    if (!params.from_district_id || !params.to_district_id || !params.from_ward_code || !params.to_ward_code) {
      return res.status(400).json({ message: "Thiếu thông tin địa chỉ gửi hoặc nhận" });
    }

    const feeData = await orderService.calculateShippingFee(params);
    res.json(feeData);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.handleCreatePaypalDeposit = async (req, res) => {
  try {
    const orderData = req.body;

    if (!orderData || typeof orderData !== "object") {
      return res.status(400).json({ error: "Dữ liệu đơn hàng không hợp lệ." });
    }

    const approvalUrl = await this.createPaypalDeposit(orderData);

    if (!approvalUrl) {
      return res.status(500).json({ error: "Không thể tạo PayPal approval URL." });
    }

    return res.status(200).json({ approvalUrl });
  } catch (error) {
    const message =
      error?.response?.data?.message || error?.response?.data || error?.message || "Lỗi không xác định";
    console.error("❌ Lỗi trong handleCreatePaypalDeposit:", message);
    return res.status(500).json({ error: message });
  }
};

exports.createPaypalDeposit = async (orderData) => {
  if (!orderData || typeof orderData !== "object") {
    throw new Error("Dữ liệu đơn hàng không hợp lệ hoặc bị thiếu.");
  }

  console.log("📥 Data nhận vào createPaypalDeposit:", orderData);

  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !secret) {
    throw new Error("PAYPAL_CLIENT_ID hoặc PAYPAL_CLIENT_SECRET không tồn tại.");
  }

  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");

  const tokenResponse = await axios.post(
    "https://api-m.sandbox.paypal.com/v1/oauth2/token",
    qs.stringify({ grant_type: "client_credentials" }),
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const accessToken = tokenResponse.data.access_token;

  const exchangeRate = await getExchangeRate();
  if (!exchangeRate || isNaN(exchangeRate)) {
    throw new Error("Không lấy được tỷ giá USD hợp lệ.");
  }

  const totalAmountVnd = orderData?.total_amount;
  const prepaidAmountVnd = orderData?.prepaid_amount || 0;
  const paymentAmountVnd =
    orderData.status === "PENDING_PAYMENT" ? prepaidAmountVnd : totalAmountVnd;

  const paymentAmountUsd = (paymentAmountVnd / exchangeRate).toFixed(2);

  const paymentResponse = await axios.post(
    "https://api-m.sandbox.paypal.com/v2/checkout/orders",
    {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: orderData.order_id,
          description: `Payment for order ${orderData.order_id}`,
          payee: { email_address: process.env.PAYPAL_BUSINESS_EMAIL },
          amount: {
            currency_code: "USD",
            value: paymentAmountUsd,
          },
        },
      ],
      application_context: {
        brand_name: "CHPTT GEAR",
        landing_page: "BILLING",
        user_action: "PAY_NOW",
        return_url: `${process.env.CLIENT_HOST}/paypal/success?orderId=${orderData.order_id}&transactionId=${orderData.transaction_id}`,
        cancel_url: `${process.env.CLIENT_HOST}/paypal/cancel?orderId=${orderData.order_id}&transactionId=${orderData.transaction_id}`,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  const approvalUrl = paymentResponse.data.links.find((link) => link.rel === "approve")?.href;

  if (!approvalUrl) {
    throw new Error("Không tìm thấy URL phê duyệt thanh toán từ PayPal.");
  }

  return approvalUrl;
};



exports.paypalOrderSuccess = async (req, res) => {
  const { token, PayerID, orderId } = req.query;

  if (!token || !PayerID || !orderId) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  try {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const secret = process.env.PAYPAL_CLIENT_SECRET;
    const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");

    // Lấy access token từ PayPal
    const tokenResponse = await axios.post(
      "https://api-m.sandbox.paypal.com/v1/oauth2/token",
      new URLSearchParams({ grant_type: "client_credentials" }),
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Capture thanh toán từ PayPal
    const captureResponse = await axios.post(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${token}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!captureResponse.data || captureResponse.data.status !== "COMPLETED") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    // Kiểm tra xem đơn hàng có tồn tại không
    const existingOrder = await Order.findOne({ where: { order_id: orderId } });

    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Xác định trạng thái thanh toán dựa vào đặt cọc
    if (existingOrder.prepaid_amount > 0) {
      existingOrder.status = "PARTIALLY_PAID"; // Thanh toán đặt cọc
    } else {
      existingOrder.status = "PAID"; // Thanh toán đầy đủ
    }

    await existingOrder.save();

    res.status(200).json({
      message: "Order payment successful",
      orderId,
      transactionId: captureResponse.data.purchase_units[0].payments.captures[0].id,
      status: existingOrder.status,
    });
  } catch (error) {
    console.error("Error in paypalOrderSuccess:", error.message);
    if (error.response) {
      console.error("PayPal error response:", error.response.data);
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.paypalOrderCancel = async (req, res) => {
  const { orderId } = req.query;

  if (!orderId) {
    return res.status(400).json({ message: "Order ID is required" });
  }

  try {
    // Tìm đơn hàng đang chờ thanh toán
    const existingOrder = await Order.findOne({
      where: { order_id: orderId },
    });

    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found or already processed" });
    }

    // Cập nhật trạng thái đơn hàng thành 'CANCELLED'
    existingOrder.status = "CANCELLED";
    await existingOrder.save();

    res.status(200).json({
      message: "Order payment has been cancelled",
      orderId,
    });
  } catch (error) {
    console.error("Error in paypalOrderCancel:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getExchangeRate = async () => {
  try {
    const response = await axios.get(
      "https://portal.vietcombank.com.vn/Usercontrols/TVPortal.TyGia/pXML.aspx?b=8"
    );

    const result = await xml2js.parseStringPromise(response.data, { explicitArray: false });


    if (!result.ExrateList || !result.ExrateList.Exrate) {
      throw new Error("Dữ liệu tỷ giá không hợp lệ.");
    }

    const rates = Array.isArray(result.ExrateList.Exrate)
      ? result.ExrateList.Exrate
      : [result.ExrateList.Exrate];

    const usdRate = rates.find((rate) => rate.$.CurrencyCode === "USD");
    if (!usdRate) throw new Error("Không tìm thấy tỷ giá USD.");

    return parseFloat(usdRate.$.Sell.replace(",", "")); // Truy cập vào `$.Sell`
  } catch (error) {
    console.error("❌ Lỗi khi lấy tỷ giá:", error.message);
    throw error;
  }
};

exports.sendEmail = async (req, res) => {
  try {
    const { email, context } = req.body;

    if (!email || !context) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    await orderService.sendEmail(email, "Xác nhận đơn hàng", "../utils/confirmationEmail.hbs", context);

    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
