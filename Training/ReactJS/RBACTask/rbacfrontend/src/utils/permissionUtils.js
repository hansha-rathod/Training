
export const hasPermission = (permissions, module, action) => {
  if (!permissions) return false
  return permissions[module]?.includes(action)
}


export const isAdminRole = (role) => {
  return role?.id === 1
}

export const canEditRolePermissions = (
  currentUserPermissions,
  targetRoleId
) => {
  // Must have edit permission on roles module
  const canEditRoles = hasPermission(
    currentUserPermissions,
    "roles",
    "edit"
  )

  if (!canEditRoles) return false

  // Nobody can edit Admin role
  if (targetRoleId === 1) return false

  return true
}










