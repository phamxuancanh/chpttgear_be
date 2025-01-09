const { DataTypes } = require('sequelize')
const sequelize = require('./init')
const { v4: uuidv4 } = require('uuid')

const RoleToPermission = sequelize.define(
    'RoleToPermission',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: uuidv4,
            allowNull: false,
            unique: true,
            primaryKey: true
        },
        roleId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true
        },
        permissionId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true
        }
    },
    {
        tableName: 'role_to_permission',
        indexes: [
            {
                unique: true,
                fields: ['roleId', 'permissionId']
            }
        ],
        timestamps: true
    }
)

module.exports = RoleToPermission