import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../features/auth/authSlice";
import userReducer from "../features/users/userSlice";
import employeeReducer from "../features/employees/employeeSlice";
import projectReducer from "../features/projects/projectSlice";
import roleReducer from "../features/roles/roleSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  users: userReducer,
  employees: employeeReducer,
  projects: projectReducer,
  roles: roleReducer
});


const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"]
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});


export const persistor = persistStore(store);