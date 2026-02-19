import './App.css'
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";


function App() {
  return (
    <>
   
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="profile/:profileId" element={<Profile />} />
                <Route path="*" element={<h1>404 Not Found</h1>} />
            </Route>

        </Routes>
   
    </>
  )
}

export default App
