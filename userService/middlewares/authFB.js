const admin = require('../config/firebase-admin-setup')

const verifyToken = async (req, res, next) => {
  const idToken = req.headers.authorization?.split(' ')[1]
  if (!idToken) {
    return res.status(401).json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    req.user = decodedToken
    next()
  } catch (error) {
    console.error('Lỗi khi xác thực token:', error.message)
    res.status(401).json({ message: 'Unauthorized: Invalid token' })
  }
}

module.exports = { verifyToken }