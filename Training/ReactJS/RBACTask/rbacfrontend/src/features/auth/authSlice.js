import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials) => {
    const { token, user } = await authService.login(credentials);

    const role = await authService.getRole(user.roleId, token);

    return { token, user, role };
  }
);


export const fetchLatestRolePermissions = createAsyncThunk(
  "auth/fetchLatestRolePermissions",
  async (roleId, { getState }) => {
    const token = getState().auth.token;
    return await authService.getRole(roleId, token);
  }
);

const initialState = {
  isAuthenticated: false,
  token: null,
  user: null,
  role: null,
  loading: false,
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.role = null;
    },
  },
  extraReducers: (builder) => {
    builder
        .addCase(loginUser.pending, (state) => {
        state.loading = true;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.role = action.payload.role;
        })
        .addCase(loginUser.rejected, (state) => {
        state.loading = false;
        })
        .addCase(fetchLatestRolePermissions.fulfilled, (state, action) => {
        state.role = action.payload;
        });
    },
});


export const { logout } = authSlice.actions;
export default authSlice.reducer;