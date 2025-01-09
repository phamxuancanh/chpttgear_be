const { fakerEN: faker } = require('@faker-js/faker')
const RoleToPermission = require('../models/role_to_permission')
const Role = require('../models/role')
const Permission = require('../models/permission')

const generateRoleId = async () => {
  const roles = await Role.findAll()
  const roleIds = roles.map(role => role.id)
  const randomIndex = Math.floor(Math.random() * roleIds.length)
  const randomRoleId = roleIds[randomIndex]
  return randomRoleId
}

const generatePermissionId = async () => {
  const permissions = await Permission.findAll()
  const permissionIds = permissions.map(permission => permission.id)
  const randomIndex = Math.floor(Math.random() * permissionIds.length)
  const randomPermissionId = permissionIds[randomIndex]
  return randomPermissionId
}

const generateRoleToPermission = async () => {
  const usedPairs = new Set()
  const roleToPermissions = []

  while (roleToPermissions.length < 6) {
    const roleId = await generateRoleId()
    let permissionIds = []

    if (roleId === 1) {
      permissionIds = [1, 2, 3]
    } else {
      const permissionId = await generatePermissionId()
      permissionIds.push(permissionId)
    }

    for (const permissionId of permissionIds) {
      const pair = `${roleId}-${permissionId}`

      if (!usedPairs.has(pair)) {
        usedPairs.add(pair)
        roleToPermissions.push({
          roleId,
          permissionId,
          createdAt: faker.date.past(),
          updatedAt: faker.date.recent()
        })
      }
    }
  }
  return roleToPermissions
}

const seedRoleToPermissions = async () => {
  try {
    const count = await RoleToPermission.count()
    if (count === 0) {
      const roleToPermissions = await generateRoleToPermission()
      await RoleToPermission.bulkCreate(roleToPermissions, { validate: true })
    } else {
      console.log('RoleToPermission table is not empty.')
    }
  } catch (error) {
    console.log(`Failed to seed RoleToPermission data: ${error}`)
  }
}

module.exports = seedRoleToPermissions
