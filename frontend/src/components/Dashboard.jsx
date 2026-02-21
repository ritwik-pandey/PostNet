import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {
    const navigate = useNavigate(); 

    useEffect(() => {

        const fetchDashboardData = async () => {
            try {
                const response = await fetch('http://localhost:5000/dashboard', {
                    method: "GET",
                    credentials: 'include',
                });
                console.log(response.ok);
                
                if (response.ok) {
                    alert('success');
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
        <div>
            <h1>Dashboard</h1>
            <p>Loading your data...</p>
        </div>
    );
}

export default Dashboard;