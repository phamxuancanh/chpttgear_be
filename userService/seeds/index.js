const seedRoles = require('./role')
const seedUsers = require('./user')
const seedDatabase = async () => {
  try {
    await seedRoles()
    await seedUsers()
  } catch (error) {
    console.log(`Failed to seed database: ${error}`)
  }
}

module.exports = seedDatabase
