import { Routes, Route } from 'react-router-dom'
import GlobalSearch from './components/GlobalSearch'
import Profile from './pages/Profile'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<GlobalSearch />} />
      <Route path="/profile/:profileId" element={<Profile />} />
    </Routes>
  )
}

export default App
