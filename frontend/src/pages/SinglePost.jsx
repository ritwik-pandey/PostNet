import { useEffect } from "react";
import { useState } from "react";
import { useParams } from 'react-router-dom';

const GetPost = () => {
    const [post,setPost] = useState([])
    const { id } = useParams();                                 

    useEffect(()=> {

        const FetchPost = async () => {
            try{
                const response = await fetch(`http://localhost:5000/posts/${id}`, {
                    method: "GET",
                    credentials: 'include'
                });

                if(response.ok){
                    const data = await response.json();
                    setPost(data);                            
                }else{
                }
            }catch(e){
                console.log(e);
                
            }
        };
        FetchPost();

    },[]);

    return (
        <div>
            <h1>Posts</h1>
            
            {post.map((post) => (
                <div key={post.id} style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
                    <h2>{post.title}</h2>
                    <p>{post.content}</p>
                    <p>{post.author_name}</p>
                </div>
            ))}
        </div>
    );

}


export default GetPost;