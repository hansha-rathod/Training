import {Outlet} from "react-router-dom"
import Navbar from "../components/Navbar"
import './MainLayout.css';

const MainLayout = () => {
    return (
        <>
            <Navbar />
            <main><Outlet /></main>

        </>
    )
}

export default MainLayout