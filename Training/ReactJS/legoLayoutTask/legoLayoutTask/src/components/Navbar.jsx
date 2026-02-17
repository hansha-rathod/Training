import './Navbar.css'

function Navbar(props) {
    return (
        <nav className="navbar">
            <h1>{props.title}</h1>
            <ul>
                <li>Home</li>
                <li>About</li>
                <li>Contact</li>
            </ul>
        </nav>
    )
}

export default Navbar