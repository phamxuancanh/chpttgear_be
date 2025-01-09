const seedCategoryExams = require('./category_exam')
// const seedPermissions = require('./permission')
const seedRoles = require('./role')
// const seedRoleToPermissions = require('./role_to_permission')
const seedUsers = require('./user')
const seedDatabase = async () => {
  try {
    await seedRoles()
    await seedUsers()
    // await seedRoutes()
  } catch (error) {
    console.log(`Failed to seed database: ${error}`)
  }
}

module.exports = seedDatabase
