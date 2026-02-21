import { useEffect } from 'react';

const Dashboard = () => {
    
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await fetch('http://localhost:5000/dashboard', {
                    method: "GET",
                    credentials: 'include',
                });

                if (response.ok) {
                    alert('success');
                } else {
                    alert('Fail');
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                alert('Fail');
            }
        };

        fetchDashboardData();
        
    }, []); 
    return (
        <div>
            <h1>Dashboard</h1>
            <p>Loading your data...</p>
        </div>
    );
}

export default Dashboard;