const { models } = require('../models')
const CryptoJS = require('crypto-js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const path = require('path')
const fs = require('fs')
const JWT = require('jsonwebtoken')
const admin = require('../config/firebase-admin-setup')

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
const bucket = admin.storage().bucket(process.env.FIREBASE_STORAGE_BUCKET); // Khởi tạo bucket

const verifyToken = async (req, res) => {
    try {
        console.log('verifyToken');
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ error: { message: 'Token is required' } });
        }

        const payload = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (!payload || !payload.userId) {
            return res.status(401).json({ error: { message: 'Invalid token payload' } });
        }

        const user = await models.User.findByPk(payload.userId);

        if (!user || user.accessToken !== token) {
            return res.status(401).json({ error: { message: 'Token verification failed' } });
        }

        if (new Date() > user.expireAccessToken) {
            return res.status(401).json({ error: { message: 'Token has expired' } });
        }

        return res.status(200).json({ isValid: true });
    } catch (err) {
        return res.status(401).json({ error: { message: err.message } });
    }
};

const signIn = async (req, res, next) => {
    try {
        const { username, password } = req.body.data
        if (!username || !password) {
            return res.status(400).json({
                code: 400,
                message: 'Email and password are required.'
            })
        }
        const user = await models.User.findOne({ where: { username } })
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

        const accessToken = await signAccessToken({ userId: user.id })
        let refreshToken = null

        // if (rememberChecked) {
            refreshToken = await signRefreshToken(user.id)
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                sameSite: 'Strict',
                maxAge: 30 * 24 * 60 * 60 * 1000
            })
        // }
        const expire = new Date()
        expire.setMonth(expire.getMonth() + 1)
        await models.User.update({ expireRefreshToken: expire }, { where: { id: user.id } })
        res.setHeader('authorization', accessToken)
        const role = await models.Role.findOne({
            where: { id: user.roleId }
        })
        const encryptedRole = CryptoJS.AES.encrypt(role.name, process.env.ACCESS_TOKEN_SECRET).toString()
        const userResult = {
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            avatar: user.avatar,
            key: encryptedRole,
            grade: user.grade,
            phone: user.phone,
            address: user.address,
            score: user.score,
            dob: user.birthOfDate ? user.birthOfDate.toISOString().split('T')[0] : ''
        }
        return res.status(200).json({ success: true, accessToken, user: userResult })
    } catch (error) {
        console.log(error)
        next(error)
    }
}
const signUp = async (req, res, next) => {
    console.log('SIGN UP')
    try {
        const { firstName, lastName, username, email, password } = req.body.data
        const userByEmail = await models.User.findOne({ where: { email } })
        if (userByEmail) {
            return res.status(401).json({ code: 401, message: 'Email is already registered.' })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await models.User.create({
            firstName,
            lastName,
            username,
            password: hashedPassword,
            email,
            type: 'local',
            emailVerified: false,
            roleId: 3
        })
        const emailToken = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })

        const confirmationUrl = `http://localhost:${process.env.CLIENT_PORT}/verify/email?token=${emailToken}`
        // template HTML
        const templatePath = path.join(__dirname, '..', 'templates', 'verify_email_template.html')
        const htmlContent = fs.readFileSync(templatePath, 'utf8')
        const htmlWithLink = htmlContent.replace('${VERIFY_URL}', confirmationUrl)
        const mailOptions = {
            from: 'canhmail292@gmail.com',
            to: email,
            subject: 'Email Confirmation',
            html: htmlWithLink
        }
        await transporter.sendMail(mailOptions)
        return res.status(200).json({ success: true, message: 'Confirmation email sent. Please check your email.' })
    } catch (error) {
        console.log(error)
        next(error)
    }
}
const verifyEmail = async (req, res, next) => {
    console.log('VERIFY EMAILLLLLL')
    try {
        const { token } = req.body.params
        console.log(req)
        console.log(token, 'token')
        if (!token) {
            return res.status(400).json({ message: 'Missing token.' })
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        console.log(decoded, 'decoded') 
        const { id, email } = decoded

        const user = await models.User.findOne({ where: { id, email } })
        if (!user) {
            return res.status(400).json({ message: 'Invalid token.' })
        }
        if (user.emailVerified) {
            return res.status(400).json({ message: 'Email is already verified.' })
        }
        user.emailVerified = true
        await user.save()
        const accessToken = await signAccessToken({ userId: user.id })

        return res.status(200).json({ success: true, message: 'Email verified successfully.', accessToken })
    } catch (error) {
        console.log(error)
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ message: 'Token has expired.' })
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({ message: 'Invalid token.' })
        }
        next(error)
    }
}
const refreshToken = async (req, res, next) => {
    console.log('REFRESH TOKENNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN')
    try {
        const refreshToken = req.cookies.refreshToken
        console.log(refreshToken, 'refreshToken')
        if (!refreshToken) {
            return res.status(403).json({ error: { message: 'Unauthorized' } })
        }
        const userId = await verifyRefreshToken(refreshToken)
        console.log(userId, 'userId')
        const accessToken = await signAccessToken({ userId: userId })
        res.setHeader('authorization', accessToken)
        console.log(accessToken)
        return res.status(200).json({ success: true, accessToken })
    } catch (error) {
        console.log(error)
        next(error)
    }
}
const signOut = async (req, res, next) => {
    console.log('SIGN OUT')
    try {
        const { refreshToken } = req.cookies
        console.log(refreshToken)
        if (!refreshToken) {
            console.log('No refresh token provided')
        } else {
            const userId = await verifyRefreshToken(refreshToken)
            const user = await models.User.findByPk(userId)
            if (!user) {
                return res.status(404).json({ error: { message: 'User not found' } })
            }
            res.cookie('refreshToken', '', { expires: new Date(0) })
            res.cookie('connect.sid', '', { expires: new Date(0) })
            user.refreshToken = null
            user.expire = null
            await user.save()
        }
        return res.status(200).json({ success: true })
    } catch (error) {
        console.log(error)
        next(error)
    }
}
const sendOTP = async (req, res, next) => {
    try {
        const { email } = req.body.data
        console.log(req.body.data, 'req.body.data')

        if (!email) {
            return res.status(400).json({ message: 'Missing email.' })
        }

        const user = await models.User.findOne({ where: { email } })
        if (!user) {
            return res.status(400).json({ message: 'User not found.' })
        }

        if (user.type !== 'local') {
            return res.status(400).json({ message: 'Please use Google to change your password.' })
        }

        const otp = Math.floor(100000 + Math.random() * 900000)
        const otpExpire = new Date()
        otpExpire.setMinutes(otpExpire.getMinutes() + 5)

        await models.User.update({ otp, otpExpire }, { where: { email } })

        const mailOptions = {
            from: 'canhmail292@gmail.com',
            to: email,
            subject: 'Email Verification Code',
            html: `Dear ${user.firstName},<br>
          Thank you for using our service.<br><br>
          Please confirm your e-mail address by entering the code below into the verification form.<br><br>
          <strong>Your OTP is ${otp}. It will expire in 5 minutes.</strong><br><br>
          * This is an automated e-mail. Please do not respond to this address.<br>
          * Please disregard this message if you receive it and did not request to change your password.`
        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
                return res.status(500).json({ message: 'Failed to send OTP.' })
            } else {
                console.log('Email sent: ' + info.response)
                return res.status(200).json({ success: true, message: 'OTP sent successfully.', otpExpire })
            }
        })
    } catch (error) {
        next(error)
    }
}
const verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body.data
        if (!email || !otp) {
            return res.status(400).json({ message: 'Missing email or OTP.' })
        }
        const user = await models.User.findOne({ where: { email } })
        if (!user) {
            return res.status(404).json({ message: 'User not found.' })
        }
        if (user.otp !== otp) {
            return res.status(401).json({ message: 'Invalid OTP.' })
        }
        if (new Date() > user.otpExpire) {
            return res.status(410).json({ message: 'OTP has expired.' })
        }
        await models.User.update({ otp: null, otpExpire: null }, { where: { email } })
        res.status(200).json({ message: 'OTP verified successfully.' })
    } catch (error) {
        next(error)
    }
}
const changePassword = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { oldPassword, newPassword } = req.body.data;
        console.log(req.body.data);
        console.log(oldPassword);
        console.log(newPassword);

        const user = await models.User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = bcrypt.compareSync(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                code: 401,
                message: 'Old password is incorrect.'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = bcrypt.hashSync(newPassword, salt);
        await user.update({ password: hashPassword });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.log('error', error);
        next(error);
    }
};
const resetPassword = async (req, res, next) => {
    try {
        const { email, newPassword } = req.body.data
        const user = await models.User.findOne({
            where: { email }
        })
        if (!user) {
            return res.status(404).json({
                code: 404,
                message: 'Email is not registered.'
            })
        }
        const hashPassword = await bcrypt.hash(newPassword, 10)
        await user.update({ password: hashPassword })
        return res.status(200).json({ success: true, message: 'Password has been reset successfully.' })
    } catch (error) {
        next(error)
    }
}
const signInOrRegisterWithGoogle = async (req, res) => {
    console.log('SIGN IN OR REGISTER WITH GOOGLE')
    try {
        const { idToken } = req.body
        if (!idToken) {
            return res.status(400).json({ message: 'Missing idToken' })
        }
        const decodedToken = await admin.auth().verifyIdToken(idToken)
        const email = decodedToken.email
        const fullName = decodedToken.name || ''
        const nameParts = fullName.split(' ')

        const userInfo = {
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            email,
            avatar: decodedToken.picture,
            type: 'google',
            emailVerified: true
        }

        let existingUser = await models.User.findOne({ where: { email: userInfo.email } })
        if (existingUser) {
            if (existingUser.type !== 'google') {
                return res.status(400).json({
                    message: `Email đã được sử dụng với phương thức đăng nhập khác (${existingUser.type}). Vui lòng đăng nhập bằng phương thức đó.`
                })
            }
            await existingUser.update(userInfo)
        } else {
            userInfo.roleId = 3
            existingUser = await models.User.create(userInfo)
        }

        const accessToken = await signAccessToken({ userId: existingUser.id })
        console.log(accessToken, 'accessTokenGoogle')
        const refreshToken = await signRefreshToken(existingUser.id)
        console.log(refreshToken, 'refreshToken')

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'Strict',
            maxAge: 30 * 24 * 60 * 60 * 1000
        })
        const expire = new Date()
        expire.setMonth(expire.getMonth() + 1)
        await models.User.update({ expire }, { where: { id: existingUser.id } })

        res.setHeader('authorization', accessToken)
        const role = await models.Role.findOne({
            where: { id: existingUser.roleId }
        })
        const encryptedRole = CryptoJS.AES.encrypt(role.name, process.env.ACCESS_TOKEN_SECRET).toString()
        const userResult = {
            id: existingUser.id,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            email: existingUser.email,
            avatar: existingUser.avatar,
            key: encryptedRole,
            emailVerified: true,
            score: existingUser.score,
        }

        return res.status(200).json({ success: true, accessToken, user: userResult })
    } catch (error) {
        console.error('Lỗi khi đăng ký với Google:', error)
        res.status(500).json({ message: 'Lỗi khi đăng ký với Google' })
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
                'phone',
                'score',
                'address',
                'birthOfDate',
                'createdAt',
                'type'
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
            phone: user.phone,
            score: user.score,
            address: user.address,
            birthOfDate: user.birthOfDate ? user.birthOfDate.toISOString().split('T')[0] : '',
            createdAt: user.createdAt.toISOString().split('T')[0],
            type: user.type
        }
        res.json(userResult)
    } catch (error) {
        console.log('error', error)
        res.status(500).json({ message: 'not found' })
    }
}
const editUserById = async (req, res, next) => {
    try {
        console.log("EDIT USER BY ID")
        const { id } = req.params
        const { firstName, lastName, email, phone, birthOfDate, address } = req.body.data
        const userToEdit = await models.User.findByPk(id)
        if (!userToEdit) {
            return res.status(404).json({ message: 'User not found' })
        }
        // const birthOfDateDB = new Date(birthOfDate)

        const updatedUser = await userToEdit.update({ firstName, lastName, birthOfDate, phone, email, address })

        return res.json(updatedUser)
    } catch (error) {
        console.log('error', error)
        res.status(500).json({ message: 'Update user fail' })
    }
}
const changeAVT = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Kiểm tra file được upload
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const image = req.file.originalname.split('.');
        const fileType = image[image.length - 1];
        const filePath = `avatars/AVT_${id}_${Date.now().toString()}.${fileType}`;

        // Tìm user trong database
        const user = await models.User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Tải lên Firebase Storage
        const blob = bucket.file(filePath);
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: req.file.mimetype,
            },
        });

        blobStream.on('error', (error) => {
            console.error('Upload error:', error);
            return res.status(500).json({ message: 'Error uploading file' });
        });

        blobStream.on('finish', async () => {
            // Lấy URL công khai của ảnh
            const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(filePath)}?alt=media`;

            // Cập nhật avatar của user
            const updatedUser = await user.update({ avatar: publicUrl });

            res.json(updatedUser);
        });

        blobStream.end(req.file.buffer);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    verifyToken,
    signIn,
    signUp,
    verifyEmail,
    refreshToken,
    signOut,
    changePassword,
    resetPassword,
    signInOrRegisterWithGoogle,
    sendOTP,
    verifyOTP,
    getUserById,
    editUserById,
    changeAVT
}