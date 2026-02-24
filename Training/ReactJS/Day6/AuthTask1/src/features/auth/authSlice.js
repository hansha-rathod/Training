import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated : false,
    user : null,
}

const authSlice = createSlice({
    name : 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
        },

        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
        },

        restoreSession: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        }
    }
})

export const {loginSuccess, logout, restoreSession} = authSlice.actions;
export default authSlice.reducer;
