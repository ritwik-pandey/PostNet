import { useState } from "react";

const CreatePost = () => {

    const [formData, setFormData] = useState({
        title: '',
        content: ''
    })

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: [e.target.value]})
    }
    
    const createPost = async (e) => {
        e.preventDefault();
        try{
            const response = await fetch('http://localhost:5000/create-post',{
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),                    
                credentials: 'include',
            })

            if(response.ok){
                    alert('OK')
            }else{
                alert(':(')
            }
        }catch(e){
            console.log(e);
        }
    };

    return (
        <>
            <form onSubmit={createPost}>
                <input name="title" 
                    type="text" 
                    className='input'
                    placeholder='title'
                    onChange={handleChange}
                />

                <input name="content" 
                    type="text" 
                    className='input'
                    placeholder='content'
                    onChange={handleChange}
                />

                <button type="submit">Post!</button>
            </form>
        </>
    )
}

export default CreatePost;