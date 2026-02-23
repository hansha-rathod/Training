import {createSlice} from '@reduxjs/toolkit'


const initialState = {
    items : [
        {
            id: 1,
            name: 'Item 1',
            price: 100
        },
        {
            id: 2,
            name: 'Item 2',
            price: 200
        },
        {
            id: 3,
            name: 'Item 3',
            price: 300
        },
        {
            id: 4,
            name: 'Item 4',
            price: 400
        }
    ]}

const inventorySlice = createSlice({
    name: 'inventory',
    initialState,
    reducers: {
        
        removeItem: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload)
        }
    }
})

export const {removeItem} = inventorySlice.actions
export default inventorySlice.reducer

