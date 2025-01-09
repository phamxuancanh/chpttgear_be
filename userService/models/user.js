const { DataTypes } = require('sequelize')
const sequelize = require('./init')

const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.STRING,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            unique: true,
            primaryKey: true
        },
        firstName: {
            type: DataTypes.STRING
        },
        lastName: {
            type: DataTypes.STRING
        },
        avatar: {
            type: DataTypes.STRING,
            defaultValue: 'https://canhbk29.s3.ap-southeast-2.amazonaws.com/defaultAVT.jpg'
        },
        email: {
            type: DataTypes.STRING
        },
        address: {
            type: DataTypes.STRING
        },
        phone: {
            type: DataTypes.STRING
        },
        gender: {
            type: DataTypes.BOOLEAN
        },

        birthOfDate: {
            type: DataTypes.DATE
        },

        password: {
            type: DataTypes.STRING,
            allowNull: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: true
        },
        refreshToken: {
            type: DataTypes.STRING
        },
        expireRefreshToken: {
            type: DataTypes.DATE
        },
        accessToken: {
            type: DataTypes.STRING
        },
        expireAccessToken: {
            type: DataTypes.DATE
        },
        otp: {
            type: DataTypes.STRING
        },
        expireOTP: {
            type: DataTypes.DATE
        },
        emailVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        roleId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        score: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    },
    {
        tableName: 'users',
        timestamps: true
    }
)

module.exports = User