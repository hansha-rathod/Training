import axiosInstance from "../../services/axiosInstance"
import { hasPermission } from "../../utils/permissionUtils"

const verify = (permissions, action) => {
  if (!hasPermission(permissions, "projects", action)) {
    throw new Error("Unauthorized action.")
  }
}

const getProjects = async (permissions) => {
  verify(permissions, "view")
  const res = await axiosInstance.get("/projects")
  return res.data
}

const addProject = async (data, permissions) => {
  verify(permissions, "add")
  const res = await axiosInstance.post("/projects", data)
  return res.data
}

const updateProject = async (id, data, permissions) => {
  verify(permissions, "edit")
  const res = await axiosInstance.patch(`/projects/${id}`, data)
  return res.data
}

const deleteProject = async (id, permissions) => {
  verify(permissions, "delete")
  const res = await axiosInstance.delete(`/projects/${id}`)
  return res.data
}

export default {
  getProjects,
  addProject,
  updateProject,
  deleteProject
}