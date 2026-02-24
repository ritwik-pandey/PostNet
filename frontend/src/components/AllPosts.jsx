import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import './AllPosts.css';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:5000/posts', {
                    method: "GET",
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setPosts(data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="dashboard-container">
            <Navbar />

            <main className="dashboard-content">
                <section className="main-feed">
                    <header className="feed-header">
                        <div className="feed-header-content">
                            <h2>Community Feed</h2>
                            <p className="feed-subtitle">Discover interesting thoughts and stories from around the world.</p>
                        </div>
                    </header>

                    <div className="posts-list">
                        {posts.map((post) => (
                            <Link to={`/posts/${post.post_id}`} key={post.post_id} className="post-card">
                                <div className="post-main-content">
                                    <div className="post-header-info">
                                        <span className="post-author-name">{post.author_name || 'Anonymous'}</span>
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

export default Posts;