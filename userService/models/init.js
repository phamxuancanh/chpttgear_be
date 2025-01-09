const { Sequelize } = require('sequelize')

const databaseInfo = {
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DB
}

const sequelize = new Sequelize(
  databaseInfo.database,
  databaseInfo.user,
  databaseInfo.password,
  {
    host: databaseInfo.host,
    dialect: 'mysql',
    port: databaseInfo.port,
    timezone: '+07:00'
  }
)

module.exports = sequelize
