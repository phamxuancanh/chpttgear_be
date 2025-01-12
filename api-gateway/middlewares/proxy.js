const { createProxyMiddleware } = require('http-proxy-middleware');
const services = require('../config/services');
const rateLimitAndTimeout = require('./rateLimit')
const verifyAccessToken = require('./authentication')
module.exports = (app) => {
    const RATE_LIMIT = 100; // request per minute
    const TIMEOUT = 10 * 1000; // 10 seconds
    // proxy cho user service
    app.use(
        '/users',
        (req, res, next) => {
            // ko fai login hay register thi phai verify token
            if (!['/users/signUp', '/users/signIn'].includes(req.path)) {
                return verifyAccessToken(req, res, next);
            }
            next();
        },
        rateLimitAndTimeout('/users', RATE_LIMIT, TIMEOUT),
        createProxyMiddleware({
            target: services.userServiceUrl,
            changeOrigin: true,
            pathRewrite: { '^/users': '' },
        })
    );

    // Proxy cho Product Service
    app.use(
        '/products',
        rateLimitAndTimeout('/products', RATE_LIMIT, TIMEOUT),
        createProxyMiddleware({
            target: services.productServiceUrl,
            changeOrigin: true,
            pathRewrite: { '^/products': '' },
        })
    );

    // Proxy cho Inventory Service
    app.use(
        '/inventory',
        verifyAccessToken,
        rateLimitAndTimeout('/inventory', RATE_LIMIT, TIMEOUT), // Middleware giới hạn và timeout
        createProxyMiddleware({
            target: services.inventoryServiceUrl,
            changeOrigin: true,
            pathRewrite: { '^/inventory': '' },
        })
    )
    

    // Proxy cho Cart Service
    app.use(
        '/cart',
        verifyAccessToken,
        rateLimitAndTimeout('/cart', RATE_LIMIT, TIMEOUT),
        createProxyMiddleware({
            target: services.cartServiceUrl,
            changeOrigin: true,
            pathRewrite: { '^/cart': '' },
        })
    );

    // Proxy cho Order Service
    app.use(
        '/orders',
        verifyAccessToken,
        rateLimitAndTimeout('/orders', RATE_LIMIT, TIMEOUT),
        createProxyMiddleware({
            target: services.orderServiceUrl,
            changeOrigin: true,
            pathRewrite: { '^/orders': '' },
        })
    );

    // Proxy cho Payment Service
    app.use(
        '/payments',
        verifyAccessToken,
        rateLimitAndTimeout('/payments', RATE_LIMIT, TIMEOUT),
        createProxyMiddleware({
            target: services.paymentServiceUrl,
            changeOrigin: true,
            pathRewrite: { '^/payments': '' },
        })
    );

    // Proxy cho Shipping Service
    app.use(
        '/shipping',
        verifyAccessToken,
        rateLimitAndTimeout('/shipping', RATE_LIMIT, TIMEOUT),
        createProxyMiddleware({
            target: services.shippingServiceUrl,
            changeOrigin: true,
            pathRewrite: { '^/shipping': '' },
        })
    );

    // Proxy cho Review & Rating Service
    app.use(
        '/reviews',
        verifyAccessToken,
        rateLimitAndTimeout('/reviews', RATE_LIMIT, TIMEOUT),
        createProxyMiddleware({
            target: services.reviewRatingServiceUrl,
            changeOrigin: true,
            pathRewrite: { '^/reviews': '' },
        })
    );

    // Proxy cho Notification Service
    app.use(
        '/notifications',
        verifyAccessToken,
        rateLimitAndTimeout('/notifications', RATE_LIMIT, TIMEOUT),
        createProxyMiddleware({
            target: services.notificationServiceUrl,
            changeOrigin: true,
            pathRewrite: { '^/notifications': '' },
        })
    );

    // Proxy cho Recommendation Service
    app.use(
        '/recommendations',
        verifyAccessToken,
        rateLimitAndTimeout('/recommendations', RATE_LIMIT, TIMEOUT),
        createProxyMiddleware({
            target: services.recommendationServiceUrl,
            changeOrigin: true,
            pathRewrite: { '^/recommendations': '' },
        })
    );
};