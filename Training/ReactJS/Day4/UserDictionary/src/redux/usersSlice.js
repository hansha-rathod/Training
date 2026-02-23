import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Admin',
      department: 'Engineering'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'Manager',
      department: 'Sales'
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      role: 'Developer',
      department: 'Engineering'
    },
    {
      id: 4,
      name: 'Alice Williams',
      email: 'alice.williams@example.com',
      role: 'Designer',
      department: 'Marketing'
    },
    {
      id: 5,
      name: 'Charlie Brown',
      email: 'charlie.brown@example.com',
      role: 'Analyst',
      department: 'Finance'
    },
    {
      id: 6,
      name: 'Diana Prince',
      email: 'diana.prince@example.com',
      role: 'Developer',
      department: 'Engineering'
    }
  ]
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    deleteUser: (state, action) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    },
    
  }
});

export const { deleteUser, addUser, updateUser } = usersSlice.actions;
export default usersSlice.reducer;
