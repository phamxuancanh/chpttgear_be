const JWT = require('jsonwebtoken');
const axios = require('axios');
const services = require('../config/services');
const API_PREFIX = require('../utils/utils').API_PREFIX

const verifyAccessToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: { message: 'Unauthorized: Token is missing' } });
    }
    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ error: { message: 'Unauthorized: Invalid token format' } });
    }
    try {
        const payload = JWT.decode(token);

        if (!payload || !payload.userId) {
            return res.status(401).json({ error: { message: 'Unauthorized: Invalid token payload' } });
        }
        const response = await axios.post(`${services.userServiceUrl}${API_PREFIX}/users/verifyToken`, {
            token,
        });
        
        if (response.status !== 200 || !response.data.isValid) {
            return res.status(401).json({ error: { message: 'Unauthorized: Token verification failed' } });
        }

        req.userId = payload.userId;
        next();
    } catch (err) {
        return res.status(401).json({ error: { message: err.message } });
    }
};

module.exports = verifyAccessToken;
