import axiosInstance from "../../services/axiosInstance"
import { hasPermission } from "../../utils/permissionUtils"

const verify = (permissions, action) => {
  if (!hasPermission(permissions, "users", action)) {
    throw new Error("Unauthorized action.")
  }
}

const getUsers = async (permissions) => {
  verify(permissions, "view")
  const res = await axiosInstance.get("/users")
  return res.data
}

const addUser = async (data, permissions) => {
  verify(permissions, "add")
  const res = await axiosInstance.post("/users", data)
  return res.data
}

const updateUser = async (id, data, permissions) => {
  verify(permissions, "edit")
  const res = await axiosInstance.patch(`/users/${id}`, data)
  return res.data
}

const deleteUser = async (id, permissions) => {
  verify(permissions, "delete")
  const res = await axiosInstance.delete(`/users/${id}`)
  return res.data
}

export default { getUsers, addUser, updateUser, deleteUser }