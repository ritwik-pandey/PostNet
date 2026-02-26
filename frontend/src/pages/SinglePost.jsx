import { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './SinglePost.css';
import { useNavigate } from 'react-router-dom';


const GetPost = () => {
    const navigate = useNavigate();

    const [post, setPost] = useState([]);
    const [comment, setComment] = useState([]);
    const { id } = useParams();

    const [formData, setFormData] = useState({
        content: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const createComment = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/${id}/comment`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include',
            });

            if (response.ok) {
                const res = await response.json();
                setComment(prevItems => [...prevItems, res[0]]);
                setFormData({ content: '' });
            }
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        const FetchPost = async () => {
            try {
                const response = await fetch(`http://localhost:5000/posts/${id}`, {
                    method: "GET",
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    setPost(data[0]);
                }
            } catch (e) {
                console.log(e);
            }
        };

        const FetchComment = async () => {
            try {
                const response = await fetch(`http://localhost:5000/posts/${id}/comments`, {
                    method: "GET",
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);

                    setComment(data);
                }
            } catch (e) {
                console.log(e);
            }
        };
        FetchPost();
        FetchComment();
    }, [id]);

    const handleClick = async (value, commentId, total_votes) => {
        let voteType = value > 0 ? "Like" : "dislike";
        try {
            const response = await fetch(`http://localhost:5000/posts/${id}/vote`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    voteType: voteType,
                    commentId: commentId,
                    total_votes: total_votes
                }),
                credentials: 'include',
            });

            if (response.ok) {
                const res = await response.json();
                setComment(prevComments =>
                    prevComments.map(c =>
                        c.id === commentId
                            ? { ...c, total_votes: Number(res) }
                            : c
                    )
                );
            }
        } catch (e) {
            console.log(e);
        }
    };

    const handleClickPost = async (value, total_votes) => {
        let voteType = value > 0 ? "Like" : "dislike";
        try {
            const response = await fetch(`http://localhost:5000/posts/${id}/Postvote`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    voteType: voteType,
                    total_votes: total_votes
                }),
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setPost(prevPost => ({
                    ...prevPost,
                    total_votes: Number(data)
                }));
            }
        } catch (e) {
            console.log(e);
        }
    };

    const deletePost = async () => {
        try {
            const response = await fetch(`http://localhost:5000/posts/${id}/delete`, {
                method: "GET",
                credentials: 'include',
            });

            if (response.ok) {
                navigate('/');
            }
        } catch (e) {
            console.log(e);
        }
    }

    const deleteComment = async (commentId) => {
        try {
            const response = await fetch(`http://localhost:5000/comments/${id}/delete/${commentId}`, {
                method: "GET",
                credentials: 'include',
            });

            if (response.ok) {
                setComment((prevComments) =>
                    prevComments.filter((c) => c.id !== commentId)
                );
            }
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div className="dashboard-container">
            <Navbar />

            <main className="dashboard-content">
                <section className="main-feed">
                    <header className="feed-header">
                        <div className="feed-header-content">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.2rem' }}>←</Link>
                                <h2>Post</h2>
                            </div>
                        </div>
                    </header>

                    <div className="single-post-wrapper">
                        {/* Main Post Section */}
                        <div className="post-detail-container">
                            <article className="post-main-card">
                                <Link to={`/user/${post.user_id}`} className="post-detail-author">
                                    {post.author_name}
                                </Link>
                                <h1 className="post-detail-title">{post.title}</h1>
                                <p className="post-detail-content">{post.content}</p>

                                <div className="vote-section">
                                    <div className="vote-controls">
                                        <button className="vote-btn up" onClick={() => handleClickPost(1, post.total_votes)}>▲</button>
                                        <span className="vote-count">{post.total_votes || 0}</span>
                                        <button className="vote-btn down" onClick={() => handleClickPost(-1, post.total_votes)}>▼</button>
                                    </div>
                                    {post.is_owner && (<button className="delete-btn" onClick={deletePost}>Delete</button>)}
                                </div>
                            </article>
                        </div>

                        {/* Comments Section */}
                        <div className="comments-container">
                            <div className="comment-form-section">
                                <form onSubmit={createComment} className="comment-form">
                                    <div className="comment-input-wrapper">
                                        <textarea
                                            name="content"
                                            className='comment-textarea'
                                            placeholder='Post your reply'
                                            value={formData.content}
                                            onChange={handleChange}
                                            required
                                        />
                                        <button type="submit" className="comment-submit-btn">Reply</button>
                                    </div>
                                </form>
                            </div>

                            <h3 className="comments-header">Replies</h3>

                            <div className="comments-list">
                                {comment.map((c) => (
                                    <div key={c.id} className="comment-card">
                                        <Link to={`/user/${c.user_id}`} className="comment-author">
                                            {c.author_name}
                                        </Link>
                                        <p className="comment-content">{c.content}</p>
                                        {c.is_owner && (<button className="delete-btn" onClick={() => deleteComment(c.id)}>Delete</button>)}

                                        <div className="vote-controls">
                                            <button className="vote-btn up" onClick={() => handleClick(1, c.id, c.total_votes)}>▲</button>
                                            <span className="vote-count" style={{ fontSize: '0.9rem' }}>{c.total_votes || 0}</span>
                                            <button className="vote-btn down" onClick={() => handleClick(-1, c.id, c.total_votes)}>▼</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default GetPost;