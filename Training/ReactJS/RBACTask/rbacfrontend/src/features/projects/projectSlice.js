import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import projectService from "./projectService"

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (_, { getState }) => {
    const permissions = getState().auth.role.permissions
    return await projectService.getProjects(permissions)
  }
)

export const addProject = createAsyncThunk(
  "projects/addProject",
  async (data, { getState }) => {
    const permissions = getState().auth.role.permissions
    return await projectService.addProject(data, permissions)
  }
)

export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async ({ id, data }, { getState }) => {
    const permissions = getState().auth.role.permissions
    return await projectService.updateProject(id, data, permissions)
  }
)

export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (id, { getState }) => {
    const permissions = getState().auth.role.permissions
    await projectService.deleteProject(id, permissions)
    return id
  }
)

const projectSlice = createSlice({
  name: "projects",
  initialState: {
    projects: [],
    loading: false,
    error: null
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false
        state.projects = action.payload
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.projects.push(action.payload)
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(p => p.id === action.payload.id)
        state.projects[index] = action.payload
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(p => p.id !== action.payload)
      })
  }
})

export default projectSlice.reducer