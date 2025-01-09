const { Sequelize } = require('sequelize')

const databaseInfo = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
}

const sequelize = new Sequelize(
  databaseInfo.database,
  databaseInfo.user,
  databaseInfo.password,
  {
    host: databaseInfo.host,
    dialect: 'postgres',
    port: databaseInfo.port,
    timezone: '+07:00',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
)

module.exports = sequelize