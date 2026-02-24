const express = require('express')
const pool = require('../db/db')
const router = express.Router();
const authMiddleWare = require('../middleware/auth')

router.post('/create-post', authMiddleWare, async (req,res)=>{
    const id = req.user.id;
    const title = req.body.title;
    const content = req.body.content;
    const insertQuery = `
    INSERT INTO posts (title, content,user_id) 
    VALUES ($1, $2, $3) 
    RETURNING *; 
  `;        
  const values = [title,content,id];
  try{
    const res = await pool.query(insertQuery, values);
    console.log(res.rows[0]);    
  }catch(err){
    console.log(err.stack);
    
  }

  
  res.send("");
})

router.get('/posts', authMiddleWare, async (req,res) => {
    try{
        const query = `
            SELECT 
                posts.id AS post_id, 
                posts.title, 
                posts.content, 
                users.name AS author_name,
                user_id
            FROM posts
            JOIN users ON posts.user_id = users.id
            ORDER BY posts.id DESC;
        `;
        const responseData = await pool.query(query);
        
        
        const jsonContent = JSON.stringify(responseData.rows);
        
        res.end(jsonContent);
    }catch(err){
        console.log(err);
    }
    
})

router.get('/posts/:id', authMiddleWare, async (req,res) => {
   

    const query = `
    SELECT 
        posts.*, 
        users.name AS author_name,
        
        COALESCE((SELECT SUM(vote_type) FROM votes WHERE post_id = posts.id), 0) AS total_votes,
        
        EXISTS (SELECT 1 FROM votes WHERE post_id = posts.id AND user_id = $2) AS liked
        
        FROM posts
        JOIN users ON posts.user_id = users.id
        WHERE posts.id = $1;
    `;

    const current_user_id = req.user.id;
    const post_id = req.params.id;

    const responseData = await pool.query(query, [post_id, current_user_id]);

    res.json(responseData.rows);
})



module.exports = router;