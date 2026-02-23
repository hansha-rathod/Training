import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    value: 0,
    history: [],
};

const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: (state) => {
            state.history.push(state.value);
            state.value += 1;
        },
        decrement: (state) => {
            state.history.push(state.value);
            state.value -= 1;
        },
        setValue: (state, action) => {
            state.history.push(state.value);
            state.value = action.payload;
        },
        reset: (state, action) => {
            state.history.push(state.value);
            state.value = 0;
        }
    },
});


export const {increment, decrement, setValue, reset} = counterSlice.actions;

export default counterSlice.reducer;

