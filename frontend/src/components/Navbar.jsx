import { useEffect, useState } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const GetId = async () => {
            try {
                const response = await fetch('http://localhost:5000/getid', {
                    method: "GET",
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserId(data.id);
                }
            } catch (error) {
                console.error("Error fetching ID:", error);
            }
        };
        GetId();
    }, []);

    return (
        <nav className="navbar">
            <div className="navbar-top">
                <Link to="/" className="nav-logo">
                    PostNet
                </Link>

                <div className="nav-links">
                    <Link to="/" className="nav-item">
                        <span className="nav-icon">🏠</span>
                        <span className="nav-text">Home</span>
                    </Link>

                    <Link to="/posts" className="nav-item">
                        <span className="nav-icon">🔍</span>
                        <span className="nav-text">Explore</span>
                    </Link>

                    <Link to={userId ? `/user/${userId}` : '#'} className="nav-item">
                        <span className="nav-icon">👤</span>
                        <span className="nav-text">Profile</span>
                    </Link>
                </div>
                <Link to="/create-post"><button className="post-btn-main">Post</button></Link>
            </div>

            <div className="navbar-bottom">
                <Link to="/logout" className="nav-item logout-item">
                    <span className="nav-text">Logout</span>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
