const { DataTypes } = require('sequelize')
const sequelize = require('./init')
const { v4: uuidv4 } = require('uuid')

const Permission = sequelize.define(
  'Permission',
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
    },
    method: {
      type: DataTypes.STRING
    },
    url: {
      type: DataTypes.STRING
    }
  },
  {
    tableName: 'permission',
    timestamps: true
  }
)

module.exports = Permission