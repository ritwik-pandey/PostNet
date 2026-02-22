import { useEffect, useState } from 'react';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
       const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:5000/posts', {
                    method: "GET",
                    credentials: 'include',
                });
                    
                if (response.ok) {
                    const data = await response.json(); 
                    setPosts(data); 
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
            
                setIsLoading(false); 
            }
        };

        fetchPosts();
    }, []);

    if (isLoading) {
        return (
            <div>
                <h1>Posts</h1>
                <p>⏳ Loading your data, please wait...</p>
            </div>
        );
    }

    return (
        <div>
            <h1>Posts</h1>
            
            {posts.map((post) => (
                <div key={post.id} style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
                    <h2>{post.title}</h2>
                    <p>{post.content}</p>
                    <p>{post.author_name}</p>
                </div>
            ))}
        </div>
    );
}

export default Posts;