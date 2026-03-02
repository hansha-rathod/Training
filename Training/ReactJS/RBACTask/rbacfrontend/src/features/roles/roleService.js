import axiosInstance from "../../services/axiosInstance"

const getRoles = async () => {
  const response = await axiosInstance.get("/roles")
  return response.data
}


export const updateRolePermissions = async (roleId, data, currentUserRole) => {

  if (roleId === 1) {
    throw new Error("Admin role cannot be modified.")
  }

  if (currentUserRole.id !== 1) {
    throw new Error("Only Admin can modify roles.")
  }

  const response = await axiosInstance.patch(`/roles/${roleId}`, data)
  return response.data
}


export default {
  getRoles,
  updateRolePermissions
}