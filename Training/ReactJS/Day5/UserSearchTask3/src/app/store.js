import {configureStore} from '@reduxjs/toolkit'
import userReducer from '../features/UserSearchSlice.js'



export const store = configureStore({
    reducer: {
        user: userReducer
    }
})