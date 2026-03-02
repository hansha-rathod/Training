import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import userService from "./userService"

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { getState }) => {
    const permissions = getState().auth.role.permissions
    return await userService.getUsers(permissions)
  }
)

export const addUser = createAsyncThunk(
  "users/addUser",
  async (data, { getState }) => {
    const permissions = getState().auth.role.permissions
    return await userService.addUser(data, permissions)
  }
)

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, data }, { getState }) => {
    const permissions = getState().auth.role.permissions
    return await userService.updateUser(id, data, permissions)
  }
)

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id, { getState }) => {
    const permissions = getState().auth.role.permissions
    await userService.deleteUser(id, permissions)
    return id
  }
)

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    loading: false,
    error: null
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.users.push(action.payload)
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u.id === action.payload.id)
        state.users[index] = action.payload
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u.id !== action.payload)
      })
  }
})

export default userSlice.reducer