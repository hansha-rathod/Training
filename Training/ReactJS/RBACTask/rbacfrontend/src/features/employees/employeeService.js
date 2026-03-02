import axiosInstance from "../../services/axiosInstance"
import { hasPermission } from "../../utils/permissionUtils"

const verify = (permissions, action) => {
  if (!hasPermission(permissions, "employees", action)) {
    throw new Error("Unauthorized action.")
  }
}

const getEmployees = async (permissions) => {
  verify(permissions, "view")
  const res = await axiosInstance.get("/employees")
  return res.data
}

const addEmployee = async (data, permissions) => {
  verify(permissions, "add")
  const res = await axiosInstance.post("/employees", data)
  return res.data
}

const updateEmployee = async (id, data, permissions) => {
  verify(permissions, "edit")
  const res = await axiosInstance.patch(`/employees/${id}`, data)
  return res.data
}

const deleteEmployee = async (id, permissions) => {
  verify(permissions, "delete")
  const res = await axiosInstance.delete(`/employees/${id}`)
  return res.data
}

export default {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee
}