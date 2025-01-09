const { fakerEN: faker } = require('@faker-js/faker')
const Role = require('../models/role')

const roles = [
  {
    name: 'R1',
    description: 'ADMIN',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    name: 'R2',
    description: 'MANAGER',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    name: 'R3',
    description: 'USER',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  }
]

const seedRoles = async () => {
  try {
    const count = await Role.count()
    if (count === 0) {
      await Role.bulkCreate(roles, { validate: true })
    } else {
      console.log('Roles table is not empty.')
    }
  } catch (error) {
    console.log(`Failed to seed Roles data: ${error}`)
  }
}

module.exports = seedRoles
