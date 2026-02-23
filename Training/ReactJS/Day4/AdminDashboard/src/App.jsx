import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './layout/DashboardLayout';

import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Settings from './pages/Settings';

import './App.css'


function App() {
 
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App
