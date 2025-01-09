const { fakerEN: faker } = require('@faker-js/faker')
const Permission = require('../models/permission')

const permissions = [
  {
    name: 'P1',
    description: 'Delete User',
    method: 'DELETE',
    url: '/api/v1/users',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    name: 'P2',
    description: 'View Role',
    method: 'GET',
    url: '/api/v1/role',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    name: 'P3',
    description: 'Edit Profile',
    method: 'PUT',
    url: '/api/v1/users',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  }
]
const seedPermissions = async () => {
  try {
    const count = await Permission.count()
    if (count === 0) {
      await Permission.bulkCreate(permissions, { validate: true })
    } else {
      console.log('Permission table is not empty.')
    }
  } catch (error) {
    console.log(`Failed to seed Permission data: ${error}`)
  }
}

module.exports = seedPermissions
