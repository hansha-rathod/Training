import {NavLink}  from 'react-router-dom';
import './Navbar.css';


function Navbar() {

    const profileId = 123;

    return (
        <nav>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to={`/profile/${profileId}`}>Profile</NavLink>
            
        </nav>
    )
}

export default Navbar