import { useState } from "react";
import "./createPost.css";

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
        <div className="create-post-container">
            <div className="create-post-card">
                <h2 className="create-post-title">Create a New Post</h2>
                <p className="create-post-subtitle">Share your thoughts with the world</p>
                <form onSubmit={createPost} className="create-post-form">
                    <div className="input-group">
                        <input name="title"
                            type="text"
                            className='post-input'
                            placeholder='Title'
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                        <span className="input-focus-border"></span>
                    </div>

                    <div className="input-group">
                        <textarea name="content"
                            className='post-textarea'
                            placeholder='What is on your mind?'
                            value={formData.content}
                            onChange={handleChange}
                            required
                        />
                        <span className="input-focus-border"></span>
                    </div>

                    <button type="submit" className="post-button">
                        <span>Publish Post</span>
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CreatePost;