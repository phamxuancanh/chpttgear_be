const { createProxyMiddleware } = require("http-proxy-middleware");
const rateLimitAndTimeout = require("./rateLimit");
const verifyAccessToken = require("./authentication");
const API_PREFIX = require("../utils/utils").API_PREFIX;
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
    createProxyMiddleware({
      target: process.env.USER_SERVICE_URL + `${API_PREFIX}/users`,
      changeOrigin: true,
      pathRewrite: { [`^${API_PREFIX}/users`]: "" },
      // timeout: TIMEOUT, // Set the timeout for the proxy
      // proxyTimeout: TIMEOUT, // Set the timeout for the proxy
    })
  );
  app.use(
    `${API_PREFIX}/products`,
    (req, res, next) => {
      console.log("req.path", req.params);
      const pathWithoutPrefix = req.path.replace(`${API_PREFIX}`, "");
      // if (!publicAPIs.includes(pathWithoutPrefix)) {
      //   return verifyAccessToken(req, res, next);
      // }
      next();
    },
    rateLimitAndTimeout("/products", RATE_LIMIT, TIMEOUT),
    createProxyMiddleware({
      target: process.env.PRODUCT_SERVICE_URL + `${API_PREFIX}`,
      changeOrigin: true,
      pathRewrite: { [`^${API_PREFIX}`]: "" },
    })
  );
  // Proxy for Inventory Service
  app.use(
    `${API_PREFIX}/inventory`,
    // verifyAccessToken,
    rateLimitAndTimeout("/inventory", RATE_LIMIT, TIMEOUT),
    createProxyMiddleware({
      target: process.env.INVENTORY_SERVICE_URL + `${API_PREFIX}/inventory`,
      changeOrigin: true,
      pathRewrite: { [`^${API_PREFIX}/inventory`]: "" },
    })
  );




  // Proxy for Cart Service
  app.use(
    `${API_PREFIX}/carts`,
    // verifyAccessToken,
    rateLimitAndTimeout("/carts", RATE_LIMIT, TIMEOUT),
    createProxyMiddleware({
      target: process.env.CART_SERVICE_URL + `${API_PREFIX}/carts`,
      changeOrigin: true,
      pathRewrite: { [`^${API_PREFIX}/carts`]: "" },
    })
  );

  // Proxy for Order Service
  app.use(
    `${API_PREFIX}/orders`,
    // verifyAccessToken,
    rateLimitAndTimeout("/orders", RATE_LIMIT, TIMEOUT),
    createProxyMiddleware({
      target: process.env.ORDER_SERVICE_URL + `${API_PREFIX}/orders`,
      changeOrigin: true,
      pathRewrite: { [`^${API_PREFIX}/orders`]: "" },
    })
  );

  // Proxy for Payment Service
  app.use(
    `${API_PREFIX}/payments`,
    // verifyAccessToken,
    rateLimitAndTimeout("/payments", RATE_LIMIT, TIMEOUT),
    createProxyMiddleware({
      target: process.env.PAYMENT_SERVICE_URL + `${API_PREFIX}/payments`,
      changeOrigin: true,
      pathRewrite: { [`^${API_PREFIX}/payments`]: "" },
    })
  );

  // Proxy for Shipping Service
  app.use(
    `${API_PREFIX}/shipping`,
    verifyAccessToken,
    rateLimitAndTimeout("/shipping", RATE_LIMIT, TIMEOUT),
    createProxyMiddleware({
      target: process.env.SHIPPING_SERVICE_URL + `${API_PREFIX}/shipping`,
      changeOrigin: true,
      pathRewrite: { [`^${API_PREFIX}/shipping`]: "" },
    })
  );

  // Proxy for Review & Rating Service
  app.use(
    `${API_PREFIX}/reviews`,
    verifyAccessToken,
    rateLimitAndTimeout("/reviews", RATE_LIMIT, TIMEOUT),
    createProxyMiddleware({
      target:
        process.env.REVIEW_RATING_SERVICE_URL + `${API_PREFIX}/review_rating`,
      changeOrigin: true,
      pathRewrite: { [`^${API_PREFIX}/reviews`]: "" },
    })
  );

  // Proxy for Notification Service
  app.use(
    `${API_PREFIX}/notifications`,
    verifyAccessToken,
    rateLimitAndTimeout("/notifications", RATE_LIMIT, TIMEOUT),
    createProxyMiddleware({
      target:
        process.env.NOTIFICATION_SERVICE_URL + `${API_PREFIX}/notifications`,
      changeOrigin: true,
      pathRewrite: { [`^${API_PREFIX}/notifications`]: "" },
    })
  );
  app.use(
    `${API_PREFIX}/recommendations`,
    (req, res, next) => {
      console.log("req.path", req.params);
      next();
    },
    rateLimitAndTimeout("/recommendations", RATE_LIMIT, TIMEOUT),
    createProxyMiddleware({
      target: process.env.RECOMMENDATION_SERVICE_URL + `${API_PREFIX}`,
      changeOrigin: true,
      pathRewrite: { [`^${API_PREFIX}`]: "" },
    })
  );
};
