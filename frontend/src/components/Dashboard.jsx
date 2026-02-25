import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0)
    const [hasMore, sethasMore] = useState(true)
    const LIMIT = 5;
    const loaderRef = useRef(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                if (!hasMore) return;
                setLoading(true);

                const response = await fetch(`http://localhost:5000?limit=${LIMIT}&offset=${offset}`, {
                    method: "GET",
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setPosts(prev => [...prev, ...data.posts]); 
                                      
                    sethasMore(data.hasMore);

                } else {
                    navigate('/login', { replace: true });
                }
                setLoading(false);

            } catch (error) {
                console.error("Error fetching data:", error);
                navigate('/login', { replace: true });
            }
        };

        fetchDashboardData();
    }, [navigate,offset]);

    useEffect(() => {
        if (!hasMore) return;
    
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading) {
                    setOffset(prev => prev + LIMIT);
                }
            },
            { threshold: 1 }
        );
    
        const current = loaderRef.current;

        if (current) observer.observe(current);
    
        return () => {
            if (current) observer.unobserve(current);
        };
    },  [loading,hasMore]);

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
                    {hasMore && <div ref={loaderRef} style={{ height: "40px" }} />}

                </section>
            </main>
        </div>
    );
}

export default Dashboard;