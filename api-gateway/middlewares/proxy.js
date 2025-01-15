const { createProxyMiddleware } = require('http-proxy-middleware');
const services = require('../config/services');
const rateLimitAndTimeout = require('./rateLimit')
const verifyAccessToken = require('./authentication')
const API_PREFIX = require('../utils/utils').API_PREFIX
module.exports = (app) => {
    const RATE_LIMIT = 100 // requests per minute
    const TIMEOUT = 10 * 1000 // 10 seconds

    // Proxy for User Service
    app.use(
        `${API_PREFIX}/users`,
        (req, res, next) => {
            const pathWithoutPrefix = req.path.replace(`${API_PREFIX}/users`, '')
            if (!['/signUp', '/signIn', '/verifyEmail', '/google', '/sendOTP','/verifyOTP','/resetPassword', '/verifyToken', '/refreshToken'].includes(pathWithoutPrefix)) {
                return verifyAccessToken(req, res, next)
            }
            next()
        },
        rateLimitAndTimeout('/users', RATE_LIMIT, TIMEOUT),
        createProxyMiddleware({
            target: services.userServiceUrl+`${API_PREFIX}/users`,
            changeOrigin: true,
            pathRewrite: { [`^${API_PREFIX}/users`]: '' },
        })
    )

    // Proxy for Product Service
    app.use(
        `${API_PREFIX}/products`,
        rateLimitAndTimeout('/products', RATE_LIMIT, TIMEOUT),
        createProxyMiddleware({
            target: services.productServiceUrl+`${API_PREFIX}/products`,
            changeOrigin: true,
            pathRewrite: { [`^${API_PREFIX}/products`]: '' },
        })
    )

    // Proxy for Inventory Service
    app.use(
        `${API_PREFIX}/inventory`,
        verifyAccessToken,
        rateLimitAndTimeout('/inventory', RATE_LIMIT, TIMEOUT),
        createProxyMiddleware({
            target: services.inventoryServiceUrl+`${API_PREFIX}/inventory`,
            changeOrigin: true,
            pathRewrite: { [`^${API_PREFIX}/inventory`]: '' },
        })
    )

    // Proxy for Cart Service
    app.use(
        `${API_PREFIX}/cart`,
        verifyAccessToken,
        rateLimitAndTimeout('/cart', RATE_LIMIT, TIMEOUT),
        createProxyMiddleware({
            target: services.cartServiceUrl+`${API_PREFIX}/cart`,
            changeOrigin: true,
            pathRewrite: { [`^${API_PREFIX}/cart`]: '' },
        })
    )

    // Proxy for Order Service
    app.use(
        `${API_PREFIX}/orders`,
        verifyAccessToken,
        rateLimitAndTimeout('/orders', RATE_LIMIT, TIMEOUT),
        createProxyMiddleware({
            target: services.orderServiceUrl+`${API_PREFIX}/orders`,
            changeOrigin: true,
            pathRewrite: { [`^${API_PREFIX}/orders`]: '' },
        })
    )

    // Proxy for Payment Service
    app.use(
        `${API_PREFIX}/payments`,
        verifyAccessToken,
        rateLimitAndTimeout('/payments', RATE_LIMIT, TIMEOUT),
        createProxyMiddleware({
            target: services.paymentServiceUrl,
            changeOrigin: true,
            pathRewrite: { [`^${API_PREFIX}/payments`]: '' },
        })
    )

    // Proxy for Shipping Service
    app.use(
        `${API_PREFIX}/shipping`,
        verifyAccessToken,
        rateLimitAndTimeout('/shipping', RATE_LIMIT, TIMEOUT),
        createProxyMiddleware({
            target: services.shippingServiceUrl+`${API_PREFIX}/shipping`,
            changeOrigin: true,
            pathRewrite: { [`^${API_PREFIX}/shipping`]: '' },
        })
    )

    // Proxy for Review & Rating Service
    app.use(
        `${API_PREFIX}/reviews`,
        verifyAccessToken,
        rateLimitAndTimeout('/reviews', RATE_LIMIT, TIMEOUT),
        createProxyMiddleware({
            target: services.reviewRatingServiceUrl,
            changeOrigin: true,
            pathRewrite: { [`^${API_PREFIX}/reviews`]: '' },
        })
    )

    // Proxy for Notification Service
    app.use(
        `${API_PREFIX}/notifications`,
        verifyAccessToken,
        rateLimitAndTimeout('/notifications', RATE_LIMIT, TIMEOUT),
        createProxyMiddleware({
            target: services.notificationServiceUrl+`${API_PREFIX}/notifications`,
            changeOrigin: true,
            pathRewrite: { [`^${API_PREFIX}/notifications`]: '' },
        })
    )

    // Proxy for Recommendation Service
    app.use(
        `${API_PREFIX}/recommendations`,
        verifyAccessToken,
        rateLimitAndTimeout('/recommendations', RATE_LIMIT, TIMEOUT),
        createProxyMiddleware({
            target: services.recommendationServiceUrl+`${API_PREFIX}/recommendations`,
            changeOrigin: true,
            pathRewrite: { [`^${API_PREFIX}/recommendations`]: '' },
        })
    )
}