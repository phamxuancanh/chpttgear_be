const express = require('express')
const router = express.Router()
const authController = require('../controllers/user')
const { verifyToken } = require('../middlewares/authFB')
router.post('/verifyEmail', authController.verifyEmail)
router.post('/verifyToken', authController.verifyToken);
router.post('/signIn', authController.signIn)
router.post('/signUp', authController.signUp)
router.post('/refreshToken', authController.refreshToken)
router.post('/signOut', authController.signOut)
router.put('/:id/changePassword', authController.changePassword)
router.post('/google', authController.signInOrRegisterWithGoogle)
router.use('/protected', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Access granted', user: req.user })
})
router.get('/:id', authController.getUserById)
router.post('/sendOTP', authController.sendOTP)
router.post('/verifyOTP', authController.verifyOTP)
router.post('/resetPassword', authController.resetPassword)

module.exports = router