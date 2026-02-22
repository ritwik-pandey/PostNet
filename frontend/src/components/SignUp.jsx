import './SignUp.css'
import { useState } from 'react';

const SignUp = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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
            }
        } catch (error) {
            console.error("Error signing up:", error);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Create Account</h2>
                <p>Join PostNet and start connecting</p>
                <form onSubmit={handleSubmit}>
                    <input
                        name="name"
                        className="input"
                        type="text"
                        placeholder="Full Name"
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="email"
                        className="input"
                        type="email"
                        placeholder="Email Address"
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="password"
                        className="input"
                        type="password"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Sign up</button>
                </form>
            </div>
        </div>
    );
}

export default SignUp;
