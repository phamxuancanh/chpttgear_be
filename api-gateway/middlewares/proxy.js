const { createProxyMiddleware } = require('http-proxy-middleware');
const services = require('../config/services');
const rateLimitAndTimeout = require('./rateLimit')

module.exports = (app) => {
    const RATE_LIMIT = 100; // request per minute
    const TIMEOUT = 10 * 1000; // 10 seconds

    app.use(
        '/users',
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
        rateLimitAndTimeout('/inventory', RATE_LIMIT, TIMEOUT),
        createProxyMiddleware({
            target: services.inventoryServiceUrl,
            changeOrigin: true,
            pathRewrite: { '^/inventory': '' },
        })
    );

    // Proxy cho Cart Service
    app.use(
        '/cart',
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
        rateLimitAndTimeout('/recommendations', RATE_LIMIT, TIMEOUT),
        createProxyMiddleware({
            target: services.recommendationServiceUrl,
            changeOrigin: true,
            pathRewrite: { '^/recommendations': '' },
        })
    );
};