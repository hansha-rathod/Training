import {configureStore} from '@reduxjs/toolkit'
import countReducer from '../features/counter/counterSlice'

export const store = configureStore({
    reducer: {
        counter: countReducer,
    }
});