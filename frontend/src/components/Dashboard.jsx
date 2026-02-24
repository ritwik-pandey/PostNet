import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await fetch('http://localhost:5000/', {
                    method: "GET",
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setPosts(data);
                } else {
                    navigate('/login', { replace: true });
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                navigate('/login', { replace: true });
            }
        };

        fetchDashboardData();
    }, [navigate]);

    return (
        <div className="dashboard-container">
            <Navbar />

            <main className="dashboard-content">
                <section className="main-feed">
                    <header className="feed-header">
                        <div className="feed-header-content">
                            <h2>Home</h2>
                        </div>
                    </header>

                    <div className="posts-list">
                        {posts.map((post) => (
                            <Link to={`/posts/${post.id}`} key={post.id} className="post-card">
                                <div className="post-main-content">
                                    <div className="post-header-info">
                                        <span className="post-author-name">{post.author_name}</span>
                                    </div>
                                    <div className="post-title-styled">{post.title}</div>
                                    <div className="post-text-content">{post.content}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Dashboard;