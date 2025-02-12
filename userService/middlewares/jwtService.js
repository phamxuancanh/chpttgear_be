const JWT = require('jsonwebtoken')
const crypto = require('crypto')
const { models } = require('../models')

const signAccessToken = async (payload) => {
  const secret = process.env.ACCESS_TOKEN_SECRET
  const options = {
    expiresIn: '5h' // Thay đổi từ '20s' thành '5h'
  }
  console.log('payload', payload)
  const userId = payload.userId
  try {
    const token = await new Promise((resolve, reject) => {
      JWT.sign({ userId }, secret, options, (err, token) => {
        if (err) return reject(err)
        resolve(token)
      })
    })
    console.log('userId', userId)
    const user = await models.User.findByPk(userId)
    user.accessToken = token
    user.expireAccessToken = new Date(Date.now() + 5 * 60 * 60 * 1000) // 5 giờ
    await user.save()

    return token
  } catch (error) {
    console.log(error)
    throw new Error('Error signing access token')
  }
}

const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ error: { message: 'Unauthorized 1' } })
  }
  const [scheme, token] = authHeader.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: { message: 'Unauthorized 1' } })
  }

  JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, { algorithms: ['HS256'] }, async (err, payload) => {
    if (err) {
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: { message: 'Unauthorized 2' } })
      }
      return res.status(401).json({ error: { message: err.message } })
    }

    const { userId } = payload
    if (!userId) {
      return res.status(401).json({ error: { message: 'Unauthorized 3' } })
    }

    const user = await models.User.findByPk(userId)
    if (!user || user.accessToken !== token) {
      return res.status(401).json({ error: { message: 'Unauthorized 4' } })
    }

    req.userId = userId
    req.payload = payload

    setTimeout(() => {
      next()
    }, 100)
  })
}

const signRefreshToken = async (userId) => {
  return new Promise(async (resolve, reject) => {
    const refreshToken = crypto.randomBytes(64).toString('hex')

    try {
      const user = await models.User.findByPk(userId)
      user.refreshToken = refreshToken
      user.expireRefreshToken = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      await user.save()
      resolve(refreshToken)
    } catch (err) {
      reject(err)
    }
  })
}

const verifyRefreshToken = (refreshToken) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await models.User.findOne({ where: { refreshToken } })
      if (!user) {
        return reject({ status: 403, message: 'Token not found' })
      }
      const now = new Date()
      if (user.expireRefreshToken < now) {
        user.refreshToken = null
        user.expireRefreshToken = null
        await user.save()
        return reject({ status: 403, message: 'Token has expired' })
      }
      resolve(user.id)
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken
}