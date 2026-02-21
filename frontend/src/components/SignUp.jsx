import './SignUp.css'
import {useState} from 'react';

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
        <form onSubmit={handleSubmit}>
            <input 
                name="name" 
                className="input" 
                type="text" 
                placeholder="Name" 
                onChange={handleChange} 
            />
            <input 
                name="email" 
                className="input" 
                type="email" 
                placeholder="Email" 
                onChange={handleChange} 
            />
            <input 
                name="password" 
                className="input" 
                type="password" 
                placeholder="Password" 
                onChange={handleChange} 
            />
            <button type="submit">Sign up!</button>
        </form>
    );
}

export default SignUp;
