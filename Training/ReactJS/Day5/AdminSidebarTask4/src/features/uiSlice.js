import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  collapsed: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.collapsed = !state.collapsed;
    },
  },
});

export const { toggleSidebar } = uiSlice.actions;
export default uiSlice.reducer;