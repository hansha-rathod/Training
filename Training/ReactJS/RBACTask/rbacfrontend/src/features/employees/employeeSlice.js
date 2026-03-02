import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import employeeService from "./employeeService"

export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async (_, { getState }) => {
    const permissions = getState().auth.role.permissions
    return await employeeService.getEmployees(permissions)
  }
)

export const addEmployee = createAsyncThunk(
  "employees/addEmployee",
  async (data, { getState }) => {
    const permissions = getState().auth.role.permissions
    return await employeeService.addEmployee(data, permissions)
  }
)

export const updateEmployee = createAsyncThunk(
  "employees/updateEmployee",
  async ({ id, data }, { getState }) => {
    const permissions = getState().auth.role.permissions
    return await employeeService.updateEmployee(id, data, permissions)
  }
)

export const deleteEmployee = createAsyncThunk(
  "employees/deleteEmployee",
  async (id, { getState }) => {
    const permissions = getState().auth.role.permissions
    await employeeService.deleteEmployee(id, permissions)
    return id
  }
)

const employeeSlice = createSlice({
  name: "employees",
  initialState: {
    employees: [],
    loading: false,
    error: null
  },
  extraReducers: builder => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false
        state.employees = action.payload
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.employees.push(action.payload)
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const index = state.employees.findIndex(e => e.id === action.payload.id)
        state.employees[index] = action.payload
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.employees = state.employees.filter(e => e.id !== action.payload)
      })
  }
})

export default employeeSlice.reducer