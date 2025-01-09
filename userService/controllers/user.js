const { models } = require('../models')
const CryptoJS = require('crypto-js')
const axios = require('axios')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const path = require('path')
const fs = require('fs')
const {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken
  } = require('../middlewares/jwtService')
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'canhmail292@gmail.com',
      pass: 'tzgrtkohlaydvmzx'
    }
  })
const signIn = async (req, res, next) => {
    try {
        const { email, password, rememberChecked } = req.body.data
        if (!email || !password) {
            return res.status(400).json({
                code: 400,
                message: 'Email and password are required.'
            })
        }
        const user = await models.User.findOne({ where: { email } })
        if (!user) {
            return res.status(401).json({
                code: 401,
                message: 'Username is not registered.'
            })
        }
        if (user.type === 'google') {
            return res.status(401).json({
                code: 401,
                message: 'Please sign in using Google.'
            })
        }
        if (user.type === 'github') {
            return res.status(401).json({
                code: 401,
                message: 'Please sign in using GitHub.'
            })
        }
        const isPasswordValid = bcrypt.compareSync(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({
                code: 401,
                message: 'Password is incorrect.'
            })
        }
        if (!user.emailVerified) {
            return res.status(401).json({
                code: 401,
                message: 'Email is not verified.'
            })
        }

        const accessToken = await signAccessToken(user.id)
        let refreshToken = null

        if (rememberChecked) {
            refreshToken = await signRefreshToken(user.id)
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                sameSite: 'Strict',
                maxAge: 30 * 24 * 60 * 60 * 1000
            })
        }
        const expire = new Date()
        expire.setMonth(expire.getMonth() + 5)
        await models.User.update({ expire }, { where: { id: user.id } })
        res.setHeader('authorization', accessToken)
        const role = await models.Role.findOne({
            where: { id: user.roleId }
        })
        const encryptedRole = CryptoJS.AES.encrypt(role.name, process.env.ACCESS_TOKEN_SECRET).toString()
        const userResult = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            avatar: user.avatar,
            key: encryptedRole,
            grade: user.grade,
            phone: user.phone,
            city: user.city,
            district: user.district,
            ward: user.ward,
            startPoint: user.starPoint,
            petId: user.petId,
            dob: user.birthOfDate ? user.birthOfDate.toISOString().split('T')[0] : ''
        }
        return res.status(200).json({ success: true, accessToken, user: userResult })
    } catch (error) {
        console.log(error)
        next(error)
    }
}
const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params
        const user = await models.User.findByPk(id, {
            attributes: [
                'avatar',
                'email',
                'firstName',
                'id',
                'lastName',
                'roleId',
                'grade',
                'phone',
                'city',
                'district',
                'ward',
                'birthOfDate',
                'starPoint',
                'petId'
            ]
        })

        if (!user) {
            return res.status(404).json({ message: 'not found' })
        }

        const role = await models.Role.findOne({
            where: { id: user.roleId }
        })
        const encryptedRole = CryptoJS.AES.encrypt(role.name, process.env.ACCESS_TOKEN_SECRET).toString()
        const userResult = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            avatar: user.avatar,
            key: encryptedRole,
            grade: user.grade,
            phone: user.phone,
            city: user.city,
            district: user.district,
            ward: user.ward,
            starPoint: user.starPoint,
            petId: user.petId,
            dob: user.birthOfDate ? user.birthOfDate.toISOString().split('T')[0] : ''
        }

        res.json(userResult)
    } catch (error) {
        console.log('error', error)
        res.status(500).json({ message: 'not found' })
    }
}
module.exports = {
    getUserById,
}