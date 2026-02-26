import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import Navbar from './Navbar';
import './AllPosts.css';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0)
    const [hasMore, sethasMore] = useState(true)
    const LIMIT = 5;
    const loaderRef = useRef(null);
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 500);
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            if (!hasMore) return;
            try {
                setLoading(true);

                const response = await fetch(`http://localhost:5000/posts?limit=${LIMIT}&offset=${offset}`, {
                    method: "GET",
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setPosts(prev => [...prev, ...data.posts]);
                    sethasMore(data.hasMore);

                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [offset]);

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
    }, [loading, hasMore]);

    useEffect(() => {
        if (debouncedQuery) {
            const getList = async () => {
                const response = await fetch(`http://localhost:5000/users?q=${debouncedQuery}`, {
                    method: "GET",
                    credentials: 'include',
                });
                if (response.ok) {
                    const data = await response.json();
                    setItems(data);
                }
            }

            getList();
            console.log("Fetching results for:", debouncedQuery);
        }
    }, [debouncedQuery]);

    function useDebounce(value, delay) {
        const [debouncedValue, setDebouncedValue] = useState(value);

        useEffect(() => {
            const handler = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);

            return () => clearTimeout(handler);
        }, [value, delay]);

        return debouncedValue;
    }


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
                        <div className="search-container">
                            <div className="search-input-wrapper">
                                <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Search creators..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            </div>
                            {query && (
                                <ul className="search-results-dropdown">
                                    {items.length > 0 ? (
                                        items.map((item) => (
                                            <li key={item.id}>
                                                <Link to={`/user/${item.id}`} className="search-result-item">
                                                    {item.name}
                                                </Link>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="no-results">No users found</li>
                                    )}
                                </ul>
                            )}
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
                    {hasMore && <div ref={loaderRef} style={{ height: "40px" }} />}
                </section>
            </main>

        </div>
    );
}

export default Posts;