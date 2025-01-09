const { fakerEN: faker } = require('@faker-js/faker')
const User = require('../models/user')
const Role = require('../models/role')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')

const findRoleIdByName = async (roleName) => {
    const role = await Role.findOne({ where: { name: roleName } })
    return role ? role.id : null
}

const seedAdminUser = async (roleId) => {
    const saltRounds = 10
    const plainPassword = 'ad123'
    const hashedPassword = bcrypt.hashSync(plainPassword, saltRounds)

    const adminUser = {
        id: uuidv4(),
        firstName: 'Admin',
        lastName: 'User',
        avatar: 'https://canhbk29.s3.ap-southeast-2.amazonaws.com/defaultAVT.jpg',
        email: 'ad@gmail.com',
        address: '123 Admin St',
        phone: '1234567890',
        gender: true,
        birthOfDate: new Date('2002-11-29'),
        password: hashedPassword,
        username: 'ad',
        refreshToken: null,
        expireRefreshToken: faker.date.future(),
        accessToken: null,
        expireAccessToken: faker.date.future(),
        otp: null,
        expireOTP: null,
        emailVerified: true,
        roleId: roleId,
        score: 0,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
    }
    return adminUser
}

const seedManagerUser = async (roleId) => {
    const saltRounds = 10
    const plainPassword = 'mn123'
    const hashedPassword = bcrypt.hashSync(plainPassword, saltRounds)

    const managerUser = {
        id: uuidv4(),
        firstName: 'Manager',
        lastName: 'User',
        avatar: 'https://canhbk29.s3.ap-southeast-2.amazonaws.com/defaultAVT.jpg',
        email: 'manager@gmail.com',
        address: '456 Manager St',
        phone: '0987654321',
        gender: true,
        birthOfDate: new Date('2002-11-29'),
        password: hashedPassword,
        username: 'manager',
        refreshToken: null,
        expireRefreshToken: faker.date.future(),
        accessToken: null,
        expireAccessToken: faker.date.future(),
        otp: null,
        expireOTP: null,
        emailVerified: true,
        roleId: roleId,
        score: 0,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
    }
    return managerUser
}

const seedNormalUser = async (roleId) => {
    const saltRounds = 10
    const plainPassword = 'us123'
    const hashedPassword = bcrypt.hashSync(plainPassword, saltRounds)

    const normalUser = {
        id: uuidv4(),
        firstName: 'Normal',
        lastName: 'User',
        avatar: 'https://canhbk29.s3.ap-southeast-2.amazonaws.com/defaultAVT.jpg',
        email: 'user@gmail.com',
        address: '789 User St',
        phone: '1122334455',
        gender: true,
        birthOfDate: new Date('2002-11-29'),
        password: hashedPassword,
        username: 'user',
        refreshToken: null,
        expireRefreshToken: faker.date.future(),
        accessToken: null,
        expireAccessToken: faker.date.future(),
        otp: null,
        expireOTP: null,
        emailVerified: true,
        roleId: roleId,
        score: 0,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
    }
    return normalUser
}

const seedUsers = async () => {
    try {
        const count = await User.count()
        if (count === 0) {
            const adminRoleId = await findRoleIdByName('R1')
            const managerRoleId = await findRoleIdByName('R2')
            const normalRoleId = await findRoleIdByName('R3')

            const adminUser = await seedAdminUser(adminRoleId)
            const managerUser = await seedManagerUser(managerRoleId)
            const normalUser = await seedNormalUser(normalRoleId)

            await User.bulkCreate([adminUser, managerUser, normalUser], { validate: true })
        } else {
            console.log('Users table is not empty.')
        }
    } catch (error) {
        console.log(`Failed to seed Users data: ${error}`)
    }
}

module.exports = seedUsers