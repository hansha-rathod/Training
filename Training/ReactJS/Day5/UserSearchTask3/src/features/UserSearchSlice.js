import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'



const initialState = {
    users: [],
    status: 'idle',
    error: null
}

const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async (searchTerm, {rejectWithValue}) => {
        try {
            const response = await axios.get(`https://jsonplaceholder.typicode.com/users?name_like=${searchTerm}`)
            return response.data
        } catch (error) {
            return rejectWithValue(error.message)
        }
    })

const userSlice = createSlice({
    name: 'user',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, 
            (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(fetchUsers.fulfilled,
            (state, action) => {
                state.status = 'succeeded'
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected,
            (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })
    }

})

export default userSlice.reducer
export {fetchUsers}


