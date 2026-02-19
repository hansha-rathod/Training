import './About.css';

function About() {
    return (
        <div className="about-container">
            <h1>About Us</h1>
            <div className="about-content">
                <h2>Our Story</h2>
                <p>Welcome to our amazing React application! This project demonstrates the power of modern web development using React and React Router.</p>

                <h2>Features</h2>
                <ul>
                    <li>Client-side routing with React Router</li>
                    <li>Beautiful gradient backgrounds</li>
                    <li>Glassmorphism design elements</li>
                    <li>Responsive and interactive UI</li>
                </ul>
            </div>

            <div className="features-grid">
                <div className="feature-card">
                    <h3>⚡ Fast</h3>
                    <p>Built with Vite for lightning-fast development and optimized production builds.</p>
                </div>
                <div className="feature-card">
                    <h3>🎨 Beautiful</h3>
                    <p>Modern design with glassmorphism effects and smooth animations.</p>
                </div>
                <div className="feature-card">
                    <h3>🔧 Flexible</h3>
                    <p>Easy to extend and customize for your specific needs.</p>
                </div>
            </div>
        </div>
    )
}


export default About