import { useEffect, useState } from "react";
import { useParams, useSearchParams } from 'react-router-dom';
import { Link } from "react-router-dom";

const GetProfile = () => {

    const { id } = useParams(); 

    const [count, setCount] = useState([])
    const [posts, setPosts] = useState([])
    
    useEffect(() => {
        const fetchCount = async () => {
            try{
                const response = await fetch(`http://localhost:5000/user/${id}`, {
                    method: "GET",
                    credentials: 'include'
                });

                if(response.ok){
                    const data = await response.json();                                        
                    setCount(data);                        
                }else{
                }
            }catch(e){
                console.log(e);
                
            }
        }

        const FetchPost = async () => {
            try{
                const response = await fetch(`http://localhost:5000/user/${id}/posts`, {
                    method: "GET",
                    credentials: 'include'
                });

                if(response.ok){
                    const data = await response.json();                                        
                    setPosts(data);                                               
                }else{
                }
            }catch(e){
                console.log(e);
                
            }
        };

        fetchCount();
        FetchPost();
    },[])

    const handleChange = async () => {
        try{
                const response = await fetch(`http://localhost:5000/user/${id}/follow`, {
                    method: "POST",
                    credentials: 'include'
                });

                if(response.ok){
                    const res = await response.json();
                    
                    if(res.action=='Follow'){
                        setCount(prevCount => ({
                            ...prevCount,
                            follows: 1,
                            total_followers: res.followers
                        }));
                    }else{
                        setCount(prevCount => ({
                            ...prevCount,
                            follows: 0,
                            total_followers: res.followers

                        }));
                    }
                                                            
                }else{
                }
            }catch(e){
                console.log(e);
                
            }
    }

    return (
        <>
        <div key={count.id} style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
                
                <h2>{count.name}</h2>
                <p>{count.total_posts} posts</p>

                <p>{count.total_followers} followers</p>
                <p>{count.total_following} following</p>
                {count.Self === false && (
                <button onClick={() => handleChange()}>
                {count.follows == 1 ? 'Unfollow' : 'Follow'}
                </button>
            )}

        </div>

        {posts.map((post) => (
            <Link to={`/posts/${post.id}`} key={post.id} >
            <div key={post.id} style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
                <h3>{post.title}</h3>
                <p>{post.content}</p>

            </div>
            </Link>
        ))}

        </>

    );
}

export default GetProfile;