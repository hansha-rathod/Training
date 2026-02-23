import {configureStore} from '@reduxjs/toolkit';
import layoutReducer from '../features/layout/layoutSlice';
import themeReducer from '../features/theme/themeSlice';

export const store = configureStore({
    reducer: {
        layout: layoutReducer,
        theme: themeReducer
    }
});