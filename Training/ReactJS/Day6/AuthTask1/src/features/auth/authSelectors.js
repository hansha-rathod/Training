export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export const selectUser = (state) => state.auth.user;

export const selectUserRole = (state) => state.auth.user?.role;

export const selectUserName = (state) => state.auth.user?.name;