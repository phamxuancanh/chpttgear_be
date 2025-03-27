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
  console.log(orderData)
  try {
    let result;
    if (orderData.payment_method === "PAYPAL") {
      return await this.createPaypalDeposit(orderData, res);
    } else if (orderData.payment_method === "COD") {
      result = await orderService.createOrder(orderData);
      // const emailContext = {
      //   orderId: result.order_id,
      //   orderDate: result.createdAt,
      //   orderTotal: result.total_amount,
      //   address: result.houseNumber,
      //   products: 
      // };

      // await orderService.sendEmail(orderData.email, "Xác nhận đơn hàng", "../utils/confirmationEmail.hbs", emailContext);
    } else {
      return res.status(400).json({ error: "Invalid payment method" });
    }
    res.status(201).json({ order: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
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

exports.createPaypalDeposit = async (reqOrData, res) => {
  const orderData = reqOrData?.body || reqOrData;
  if (!orderData || typeof orderData !== "object") {
    throw new Error("Lỗi: Dữ liệu đơn hàng không hợp lệ hoặc bị thiếu.");
  }

  console.log("📥 Data nhận vào createPaypalDeposit:", orderData);

  try {

    const clientId = process.env.PAYPAL_CLIENT_ID;
    const secret = process.env.PAYPAL_CLIENT_SECRET;
    if (!clientId || !secret) {
      throw new Error("Lỗi: PAYPAL_CLIENT_ID hoặc PAYPAL_CLIENT_SECRET không tồn tại.");
    }

    const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");

    console.log("🔑 Gọi PayPal để lấy access token...");
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
      throw new Error("Lỗi: Không lấy được tỷ giá USD hợp lệ.");
    }

    const totalAmountVnd = orderData?.total_amount;
    const prepaidAmountVnd = orderData?.prepaid_amount || 0;
    const paymentAmountVnd = orderData.status === "PENDING_PAYMENT" ? prepaidAmountVnd : totalAmountVnd;

    const paymentAmountUsd = (paymentAmountVnd / exchangeRate).toFixed(2).toString();

    const newOrder = await Order.create({
      user_id: orderData?.user_id,
      total_amount: totalAmountVnd,
      shipping_amount: orderData.shipping_amount || 0.0,
      status: orderData?.status,
      payment_method: orderData?.payment_method,
      provinceCode: orderData?.provinceCode,
      districtCode: orderData?.districtCode,
      wardCode: orderData?.wardCode,
      houseNumber: orderData?.houseNumber,
      prepaid_amount: prepaidAmountVnd,
    });

    const newPayment = await axios.post(`${process.env.GATEWAY_HOST}/api/v1/payments/`, {
      order_id: newOrder.order_id,
      user_id: orderData.user_id,
      payment_method: "PAYPAL",
      amount: paymentAmountVnd,
    });



    const newTransaction = await axios.post(
      `${process.env.GATEWAY_HOST}/api/v1/payments/transactions/`,
      {
        payment_id: newPayment.data.payment_id,
        user_id: orderData.user_id,
        transaction_type: "DEBIT",
        amount: paymentAmountVnd,
        status: "INIT",
      }
    );

    console.log("🔗 Gửi request tạo đơn hàng PayPal...");
    const paymentResponse = await axios.post(
      "https://api-m.sandbox.paypal.com/v2/checkout/orders",
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: newOrder.order_id,
            description: `Payment for order ${newOrder.order_id}`,
            payee: { email_address: process.env.PAYPAL_BUSINESS_EMAIL },
            amount: {
              currency_code: "USD",
              value: paymentAmountUsd.toString(),
            },
          },
        ],
        application_context: {
          brand_name: "CHPTT GEAR",
          landing_page: "BILLING",
          user_action: "PAY_NOW",
          return_url: `${process.env.CLIENT_HOST}/paypal/success?orderId=${newOrder.order_id}&transactionId=${newTransaction.data.transaction_id}`,
          cancel_url: `${process.env.CLIENT_HOST}/paypal/cancel?orderId=${newOrder.order_id}&transactionId=${newTransaction.data.transaction_id}`,
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
      throw new Error("Lỗi: Không tìm thấy URL phê duyệt thanh toán từ PayPal.");
    }

    return res.status(201).json({ order: newOrder, approvalUrl });
  } catch (error) {
    console.error("🚨 Lỗi trong createPaypalDeposit:", error.response?.data || error.message);
    throw error;
  }
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
      where: { order_id: orderId, status: "PENDING" },
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
