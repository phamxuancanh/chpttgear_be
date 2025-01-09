const sequelize = require('./init')
const User = require('./user')
const Permission = require('./permission')
const Role = require('./role')
const RoleToPermission = require('./role_to_permission')

Role.hasMany(User, { foreignKey: 'roleId' })
User.belongsTo(Role, { foreignKey: 'roleId' })

RoleToPermission.belongsTo(Role, { foreignKey: 'roleId' })
RoleToPermission.belongsTo(Permission, { foreignKey: 'permissionId' })

Role.belongsToMany(Permission, { through: RoleToPermission, foreignKey: 'roleId' })
Permission.belongsToMany(Role, { through: RoleToPermission, foreignKey: 'permissionId' })

module.exports = {
    sequelize,
    models: {
      User,
      Permission,
      Role,
      RoleToPermission
    }
  }