const JWT = require("jsonwebtoken");
const crypto = require("crypto");
const { models } = require("../models");

// Tạo access token và lưu vào DB
const signAccessToken = async (payload) => {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  const options = {
    expiresIn: "5h",
  };

  const userId = payload.userId;

  try {
    const token = await new Promise((resolve, reject) => {
      JWT.sign({ userId }, secret, options, (err, token) => {
        if (err) return reject(err);
        resolve(token);
      });
    });

    const user = await models.User.findByPk(userId);
    if (!user) throw new Error("User not found");

    user.accessToken = token;
    user.expireAccessToken = new Date(Date.now() + 5 * 60 * 60 * 1000); // 5h
    await user.save();

    return token;
  } catch (error) {
    console.log(error);
    throw new Error("Error signing access token");
  }
};

// Middleware xác thực access token
const verifyAccessToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: { message: "Unauthorized: Missing token" } });
  }

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: { message: "Unauthorized: Invalid format" } });
  }

  JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, payload) => {
    if (err) {
      return res.status(401).json({ error: { message: "Unauthorized: Invalid token" } });
    }

    const { userId } = payload;
    if (!userId) {
      return res.status(401).json({ error: { message: "Unauthorized: Invalid payload" } });
    }

    const user = await models.User.findByPk(userId);
    if (!user || user.accessToken !== token) {
      return res.status(401).json({ error: { message: "Unauthorized: Token mismatch" } });
    }

    req.userId = userId;
    req.payload = payload;

    next();
  });
};

// Tạo refresh token và lưu vào DB
const signRefreshToken = async (userId) => {
  const refreshToken = crypto.randomBytes(64).toString("hex");

  try {
    const user = await models.User.findByPk(userId);
    if (!user) throw new Error("User not found");

    user.refreshToken = refreshToken;
    user.expireRefreshToken = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 ngày
    await user.save();

    return refreshToken;
  } catch (err) {
    throw new Error("Error signing refresh token");
  }
};

// Xác thực refresh token
const verifyRefreshToken = async (refreshToken) => {
  try {
    const user = await models.User.findOne({ where: { refreshToken } });
    if (!user) {
      throw { status: 403, message: "Refresh token not found" };
    }

    const now = new Date();
    if (user.expireRefreshToken < now) {
      user.refreshToken = null;
      user.expireRefreshToken = null;
      await user.save();
      throw { status: 403, message: "Refresh token has expired" };
    }

    return user.id;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
};
