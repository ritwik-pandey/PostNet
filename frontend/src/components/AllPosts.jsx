import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

    if (isLoading) {
        return (
            <div className="posts-page-container">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Fetching the latest stories...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="posts-page-container">
            <header className="posts-header">
                <h1>Community Feed</h1>
                <p>Discover interesting thoughts and stories from around the world.</p>
            </header>

            <div className="posts-grid">
                {posts.map((post) => (
                    <Link to={`/posts/${post.post_id}`} key={post.post_id} className="post-card-link">
                        <article className="post-card">
                            <h2>{post.title}</h2>
                            <p className="post-content-preview">{post.content}</p>
                            <div className="post-metadata">
                                <div className="author-info">
                                    <div className="author-avatar"></div>
                                    <span className="author-name">{post.author_name || 'Anonymous'}</span>
                                </div>
                            </div>
                        </article>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Posts;