const { DataTypes } = require('sequelize')
const sequelize = require('./init')

const Role = sequelize.define(
  'Role',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      // defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING
    }
  },
  {
    tableName: 'roles',
    timestamps: true
  }
)

module.exports = Role
