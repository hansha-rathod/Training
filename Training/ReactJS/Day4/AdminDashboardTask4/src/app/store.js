import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../features/theme/themeSlice";
import layoutReducer from "../features/layout/layoutSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    layout: layoutReducer,
  },
});