import { useState } from "react";
import "./createPost.css";
import Navbar from "./Navbar";

const CreatePost = () => {

    const [formData, setFormData] = useState({
        title: '',
        content: ''
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const createPost = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/create-post', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include',
            })

            if (response.ok) {
                alert('Post created successfully!')
            } else {
                alert('Failed to create post.')
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
                            <h2>Create a New Post</h2>
                        </div>
                    </header>

                    <div className="create-post-wrapper">
                        <div className="create-post-form-card">
                            <p className="create-post-subtitle">Share your thoughts with the world</p>

                            <form onSubmit={createPost} className="create-post-form">
                                <div className="input-group-styled">
                                    <label className="input-label">Title</label>
                                    <input
                                        name="title"
                                        type="text"
                                        className='post-input-field'
                                        placeholder='Capture attention with a title'
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="input-group-styled">
                                    <label className="input-label">Content</label>
                                    <textarea
                                        name="content"
                                        className='post-textarea-field'
                                        placeholder='What are you thinking about?'
                                        value={formData.content}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <button type="submit" className="publish-button">
                                    Publish Post
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default CreatePost;