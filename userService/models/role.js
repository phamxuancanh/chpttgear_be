const { DataTypes } = require('sequelize')
const sequelize = require('./init')
const { v4: uuidv4 } = require('uuid')

const Role = sequelize.define(
  'Role',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
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