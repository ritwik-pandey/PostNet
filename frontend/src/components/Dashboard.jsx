import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate(); 
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        
        const fetchDashboardData = async () => {
            try {
                const response = await fetch('http://localhost:5000/', {
                    method: "GET",
                    credentials: 'include',
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setPosts(data);
                } else {
                    
                    navigate('/login', { replace: true });

                }
            } catch (error) {
                console.error("Error fetching data:", error);
                navigate('/login', { replace: true });
            }
        };

        fetchDashboardData();
        
    }, [navigate]); 
    return (
        <>
        {posts.map((post) => (
            <div key={post.id} style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
                <Link to={`/posts/${post.id}`} key={post.id}>   
                    <h2>{post.title}</h2>
                    <p>{post.content}</p>
                    <p>{post.author_name}</p>
                </Link>
            </div>
                    
                ))}
                </>
    );
}

export default Dashboard;