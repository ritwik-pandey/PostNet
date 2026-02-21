import './LogIn.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
const LogIn = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }
    const navigate = useNavigate(); 

    const handleSubmit = async(e) => {
        e.preventDefault();

        try{
            const response = await fetch('http://localhost:5000/login', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include',
            })

            if(response.ok){
                console.log(response.ok);
                
                // navigate('/dashboard', { replace: true });
                
            }else{
                alert("wrong input");
            }
        }catch(e){
            console.log(e);
            
        }
    };

    return (
        <>
        <form onSubmit={handleSubmit}>
            <input name="email" 
                type="email" 
                className='input'
                placeholder='email'
                onChange={handleChange}
            />

            <input name="password" 
                type="password" 
                className='input'
                placeholder='password'
                onChange={handleChange}
            />

            <button type="submit">Log in</button>
        </form>
        </>
    )
}

export default LogIn;