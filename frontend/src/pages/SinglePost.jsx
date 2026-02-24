import { useEffect } from "react";
import { useState } from "react";
import { Link, useParams } from 'react-router-dom';

const GetPost = () => {
    const [post,setPost] = useState([])
    const [comment, setComment] = useState([])
    
    const { id } = useParams(); 
    
     const [formData, setFormData] = useState({
        
        content: ''
    })

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: [e.target.value]})
    }
    
    const createComment = async (e) => {
        e.preventDefault();
        try{
            const response = await fetch(`http://localhost:5000/${id}/comment`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),                    
                credentials: 'include',
            })

            if(response.ok){
                const res = await response.json();   
                console.log(res[0]);
                                  
                setComment(prevItems => [...prevItems, res[0]]);

            }
        }catch(e){
            console.log(e);
            
        }
    }

    useEffect(()=> {

        const FetchPost = async () => {
            try{
                const response = await fetch(`http://localhost:5000/posts/${id}`, {
                    method: "GET",
                    credentials: 'include'
                });

                if(response.ok){
                    const data = await response.json();                                
                    setPost(data[0]);                            
                }else{
                }
            }catch(e){
                console.log(e);
                
            }
        };

        const FetchComment = async () => {
            try{
                const response = await fetch(`http://localhost:5000/posts/${id}/comments`, {
                    method: "GET",
                    credentials: 'include'
                });

                if(response.ok){
                    const data = await response.json(); 
                    console.log(data);
                                 
                    setComment(data);                            
                }else{
                }
            }catch(e){
                console.log(e);
                
            }
        }
        FetchPost();
        FetchComment();

    },[]);

    const handleClick = async (value, commentId, total_votes) => {
        
        let voteType="";
        if(value > 0){
            voteType="Like";
        }else{
            voteType="dislike";
        }
        try{
            const response = await fetch(`http://localhost:5000/posts/${id}/vote`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    voteType: voteType, 
                    commentId: commentId ,
                    total_votes: total_votes
                }),                    
                credentials: 'include',
            })

            if(response.ok){
                const res = await response.json();
                setComment(prevComments => 
                prevComments.map(c => 
                    c.id === commentId 
                        ? { ...c, total_votes: Number(res) } 
                        : c 
                )
            );
            }
        }catch(e){
            console.log(e);
            
        }

    }

    const handleClickPost = async (value, total_votes) => {
        let voteType="";
        if(value > 0){
            voteType="Like";
        }else{
            voteType="dislike";
        }
        try{
            const response = await fetch(`http://localhost:5000/posts/${id}/Postvote`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    voteType: voteType, 
                    total_votes: total_votes
                }),                    
                credentials: 'include',
            })

            if(response.ok){
                const data = await response.json();
                
                
                setPost(prevPost => ({
                ...prevPost,
                total_votes: Number(data)
            }));
                
            }
        }catch(e){
            console.log(e);
            
        }
    }

    return (
        <div>
            <h1>Posts</h1>
            
            
            <div key={post.id} style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
                
                <h2>{post.title}</h2>
                <p>{post.content}</p>
                <Link to={`/user/${post.user_id}`}><p>{post.author_name}</p></Link>
                <p>{post.total_votes}</p>
                <button onClick={() => handleClickPost(1,post.total_votes)}>Upvote</button>
                <button onClick={() => handleClickPost(-1, post.total_votes)}>Downvote</button>
            </div>
            

            {comment.map((comment) => (

                <div key={comment.id} style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
                    <p>{comment.content}</p>
                    <p>{comment.total_votes}</p>
                    <Link to={`/user/${comment.user_id}`}><p>{comment.author_name}</p></Link>

                    <button onClick={() => handleClick(1,comment.id,comment.total_votes)}>Upvote</button>
                    <button onClick={() => handleClick(-1, comment.id,comment.total_votes)}>Downvote</button>
                </div>
            ))}

            <form onSubmit={createComment}>
                <input name="content" 
                    type="text" 
                    className=''
                    placeholder='content'
                    onChange={handleChange}
                />

                <button type="submit">comment!</button>
            </form>
        </div>
    );

}


export default GetPost;