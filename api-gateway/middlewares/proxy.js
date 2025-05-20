const { createProxyMiddleware } = require("http-proxy-middleware");
const rateLimitAndTimeout = require("./rateLimit");
const verifyAccessToken = require("./authentication");
const API_PREFIX = require("../utils/utils").API_PREFIX;
const proxyWithRetry = require('./proxyWithRetry');

module.exports = (app) => {
  const RATE_LIMIT = 1000; // requests per minute
  const TIMEOUT = 10 * 1000; // 10 seconds
  const publicAPIs = [
    "/signUp",
    "/signIn",
    "/verifyEmail",
    "/google",
    "/sendOTP",
    "/verifyOTP",
    "/resetPassword",
    "/verifyToken",
    "/refreshToken",
  ];

  app.use(
  `${API_PREFIX}/users`,
  (req, res, next) => {
    const pathWithoutPrefix = req.path.replace(`${API_PREFIX}/users`, "");
    if (!publicAPIs.includes(pathWithoutPrefix)) {
      return verifyAccessToken(req, res, next);
    }
    next();
  },
  rateLimitAndTimeout("/users", RATE_LIMIT, TIMEOUT),
  proxyWithRetry({
    target: process.env.USER_SERVICE_URL + `${API_PREFIX}/users`,
    changeOrigin: true,
    pathRewrite: { [`^${API_PREFIX}/users`]: "" },
    retries: 3,        // số lần retry
    retryDelay: 300    // ms giữa các lần retry
    // timeout: TIMEOUT, // Nếu muốn timeout ở proxy
    // proxyTimeout: TIMEOUT,
  })
);
app.use(
    `${API_PREFIX}/products`,
    (req, res, next) => {
      console.log("req.path", req.params);
      const pathWithoutPrefix = req.path.replace(`${API_PREFIX}`, "");
      next();
    },
    rateLimitAndTimeout("/products", RATE_LIMIT, TIMEOUT),
    proxyWithRetry({
      target: process.env.PRODUCT_SERVICE_URL + `${API_PREFIX}`,
      changeOrigin: true,
      pathRewrite: { [`^${API_PREFIX}`]: "" },
      retries: 3,
      retryDelay: 300,
    })
  );

  // INVENTORY
  app.use(
    `${API_PREFIX}/inventory`,
    rateLimitAndTimeout("/inventory", RATE_LIMIT, TIMEOUT),
    proxyWithRetry({
      target: process.env.INVENTORY_SERVICE_URL + `${API_PREFIX}/inventory`,
      changeOrigin: true,
      pathRewrite: { [`^${API_PREFIX}/inventory`]: "" },
      retries: 3,
      retryDelay: 300,
    })
  );

  // CARTS
  app.use(
    `${API_PREFIX}/carts`,
    rateLimitAndTimeout("/carts", RATE_LIMIT, TIMEOUT),
    proxyWithRetry({
      target: process.env.CART_SERVICE_URL + `${API_PREFIX}/carts`,
      changeOrigin: true,
      pathRewrite: { [`^${API_PREFIX}/carts`]: "" },
      retries: 3,
      retryDelay: 300,
    })
  );

  // ORDERS
  app.use(
    `${API_PREFIX}/orders`,
    rateLimitAndTimeout("/orders", RATE_LIMIT, TIMEOUT),
    proxyWithRetry({
      target: process.env.ORDER_SERVICE_URL + `${API_PREFIX}/orders`,
      changeOrigin: true,
      pathRewrite: { [`^${API_PREFIX}/orders`]: "" },
      retries: 3,
      retryDelay: 300,
    })
  );

  // PAYMENTS
  app.use(
    `${API_PREFIX}/payments`,
    rateLimitAndTimeout("/payments", RATE_LIMIT, TIMEOUT),
    proxyWithRetry({
      target: process.env.PAYMENT_SERVICE_URL + `${API_PREFIX}/payments`,
      changeOrigin: true,
      pathRewrite: { [`^${API_PREFIX}/payments`]: "" },
      retries: 3,
      retryDelay: 300,
    })
  );

  // SHIPPING
  app.use(
    `${API_PREFIX}/shipping`,
    rateLimitAndTimeout("/shipping", RATE_LIMIT, TIMEOUT),
    proxyWithRetry({
      target: process.env.SHIPPING_SERVICE_URL + `${API_PREFIX}/shipping`,
      changeOrigin: true,
      pathRewrite: { [`^${API_PREFIX}/shipping`]: "" },
      retries: 3,
      retryDelay: 300,
    })
  );

  // REVIEW & RATING
  app.use(
    `${API_PREFIX}/review`,
    rateLimitAndTimeout("/review", RATE_LIMIT, TIMEOUT),
    proxyWithRetry({
      target: process.env.REVIEW_RATING_SERVICE_URL + `${API_PREFIX}/review`,
      changeOrigin: true,
      pathRewrite: { [`^${API_PREFIX}/review`]: "" },
      retries: 3,
      retryDelay: 300,
    })
  );

  // RECOMMENDATIONS
  app.use(
    `${API_PREFIX}/recommendations`,
    (req, res, next) => {
      console.log("req.path", req.params);
      next();
    },
    rateLimitAndTimeout("/recommendations", RATE_LIMIT, TIMEOUT),
    proxyWithRetry({
      target: process.env.RECOMMENDATION_SERVICE_URL + `${API_PREFIX}`,
      changeOrigin: true,
      pathRewrite: { [`^${API_PREFIX}`]: "" },
      retries: 3,
      retryDelay: 300,
    })
  );
};