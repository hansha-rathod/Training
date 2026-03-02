import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import roleService from "./roleService"
import { fetchLatestRolePermissions } from "../auth/authSlice"

export const fetchRoles = createAsyncThunk(
  "roles/fetchRoles",
  async () => {
    return await roleService.getRoles()
  }
)

export const updateRole = createAsyncThunk(
  "roles/updateRole",
  async ({ roleId, permissions, currentUserRole }, { dispatch }) => {
    const response = await roleService.updateRolePermissions(
      roleId,
      { permissions },
      currentUserRole
    )

    // Rehydrate if current user role changed
    if (currentUserRole.id === roleId) {
      dispatch(fetchLatestRolePermissions(roleId))
    }

    return response
  }
)

const roleSlice = createSlice({
  name: "roles",
  initialState: {
    roles: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false
        state.roles = action.payload
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(updateRole.pending, (state) => {
        state.loading = true
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.loading = false
        const index = state.roles.findIndex((r) => r.id === action.payload.id)
        if (index !== -1) {
          state.roles[index] = action.payload
        }
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export default roleSlice.reducer

