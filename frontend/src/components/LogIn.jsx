import './LogIn.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
const LogIn = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include',
            })

            if (response.ok) {
                console.log(response.ok);

                navigate('/dashboard', { replace: true });

            } else {
                alert("wrong input");
            }
        } catch (e) {
            console.log(e);

        }
    };

    return (
        <div className="login-container">
            <div className="login-left">
                <div className="quote-container">
                    <p className="wise-quote">Document your life</p>
                    <div className="quote-line"></div>
                </div>
                <div className="bottom-text">
                    <h1>Get Everything You Want</h1>
                    <p>Explore, Follow, write, Enjoy!</p>
                </div>
            </div>
            <div className="login-right">
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
                    <h2>Welcome Back</h2>
                    <p className="subtitle">Enter your email and password to access your account</p>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Email</label>
                            <input
                                name="email"
                                type="email"
                                className='login-input'
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
                                    className='login-input'
                                    placeholder='Enter your password'
                                    onChange={handleChange}
                                    required
                                />
                                <button type="button" className="toggle-password">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="eye-icon">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        

                        <button type="submit" className="sign-in-btn">Sign In</button>

                        
                    </form>

                    <p className="signup-prompt">
                        Don't have an account? <a href="/signup">Sign Up</a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LogIn;