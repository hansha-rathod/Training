import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    collapsed: false
};

const layoutSlice = createSlice({
    name: 'layout',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.collapsed = !state.collapsed;
        },

        setCollapsed: (state, action) => {
            state.collapsed = action.payload;
        },
    },
})



export const {toggleSidebar, setCollapsed} = layoutSlice.actions;
export default layoutSlice.reducer;