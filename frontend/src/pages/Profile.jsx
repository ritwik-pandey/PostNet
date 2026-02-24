import { useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Profile.css';

const GetProfile = () => {
    const { id } = useParams();
    const [userData, setUserData] = useState([]);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/user/${id}`, {
                    method: "GET",
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                }
            } catch (e) {
                console.log(e);
            }
        };

        const FetchPost = async () => {
            try {
                const response = await fetch(`http://localhost:5000/user/${id}/posts`, {
                    method: "GET",
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    setPosts(data);
                }
            } catch (e) {
                console.log(e);
            }
        };

        fetchUserData();
        FetchPost();
    }, [id]);

    const handleFollowToggle = async () => {
        try {
            const response = await fetch(`http://localhost:5000/user/${id}/follow`, {
                method: "POST",
                credentials: 'include'
            });

            if (response.ok) {
                const res = await response.json();
                setUserData(prev => ({
                    ...prev,
                    follows: res.action === 'Follow' ? 1 : 0,
                    total_followers: res.followers
                }));
            }
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className="dashboard-container">
            <Navbar />

            <main className="dashboard-content">
                <section className="main-feed">
                    <header className="feed-header">
                        <div className="feed-header-content">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.2rem' }}>←</Link>
                                <h2>{userData.name || 'Profile'}</h2>
                            </div>
                        </div>
                    </header>

                    <div className="profile-wrapper">
                        <div className="profile-banner"></div>

                        <div className="profile-info-section">
                            <div className="profile-avatar-container">
                                <div className="profile-avatar">
                                    {userData.name ? userData.name[0] : '?'}
                                </div>
                                {userData.Self === false && (
                                    <button
                                        className={`follow-btn ${userData.follows === 1 ? 'following' : ''}`}
                                        onClick={handleFollowToggle}
                                    >
                                        {userData.follows === 1 ? 'Following' : 'Follow'}
                                    </button>
                                )}
                            </div>

                            <div className="profile-name-details">
                                <h2>{userData.name}</h2>
                                <p className="profile-handle">@{userData.name?.toLowerCase().replace(/\s+/g, '')}</p>

                                <div className="profile-stats">
                                    <div className="stat-item"><span>{userData.total_following || 0}</span> Following</div>
                                    <div className="stat-item"><span>{userData.total_followers || 0}</span> Followers</div>
                                    <div className="stat-item"><span>{userData.total_posts || 0}</span> Posts</div>
                                </div>
                            </div>
                        </div>

                        <div className="profile-feed-header">Posts</div>

                        <div className="user-posts-list">
                            {posts.map((post) => (
                                <Link to={`/posts/${post.id}`} key={post.id} className="post-card">
                                    <div className="post-main-content">
                                        <div className="post-header-info">
                                            <span className="post-author-name">{userData.name}</span>
                                        </div>
                                        <div className="post-title-styled">{post.title}</div>
                                        <div className="post-text-content">{post.content}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default GetProfile;