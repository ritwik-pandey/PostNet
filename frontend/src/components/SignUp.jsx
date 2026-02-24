import './SignUp.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Sign up successful!");
                navigate('/login');
            }
        } catch (error) {
            console.error("Error signing up:", error);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-left">
                <div className="quote-container">
                    <p className="wise-quote">Join the community</p>
                    <div className="quote-line"></div>
                </div>
                <div className="bottom-text">
                    <h1>Start Your Journey</h1>
                    <p>Connect, Share, and Discover amazing stories.</p>
                </div>
            </div>
            <div className="signup-right">
                <div className="brand-header">
                    <div className="brand-logo">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <span className="brand-name">PostNet</span>
                </div>

                <div className="form-wrapper">
                    <h2>Create Account</h2>
                    <p className="subtitle">Join PostNet and start connecting with others</p>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Full Name</label>
                            <input
                                name="name"
                                type="text"
                                className='signup-input'
                                placeholder='Enter your full name'
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Email</label>
                            <input
                                name="email"
                                type="email"
                                className='signup-input'
                                placeholder='Enter your email'
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Password</label>
                            <div className="password-wrapper">
                                <input
                                    name="password"
                                    type="password"
                                    className='signup-input'
                                    placeholder='Create a password'
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="sign-up-btn">Sign Up</button>
                    </form>

                    <p className="login-prompt">
                        Already have an account? <a href="/login">Sign In</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignUp;

