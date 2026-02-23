import {configureStore} from '@reduxjs/toolkit'
import inventoryReducer from '../features/InventorySlice.js'


export const store = configureStore({
    reducer: {
        inventory: inventoryReducer
    }
})