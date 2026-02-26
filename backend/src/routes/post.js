const express = require('express')
const pool = require('../db/db')
const router = express.Router();
const authMiddleWare = require('../middleware/auth')
const rateLimitPost = require('../middleware/rateLimiter')

router.post('/create-post', authMiddleWare,rateLimitPost, async (req,res)=>{
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
        const { limit, offset } = req.query;
        
        const queryLimit = Number(limit) + 1; 

        const query = `
        SELECT 
            posts.id AS post_id, 
            posts.title, 
            posts.content, 
            users.name AS author_name,
            user_id
        FROM posts
        JOIN users ON posts.user_id = users.id
        WHERE posts.is_deleted = false
        ORDER BY posts.created_at DESC
        LIMIT $1 OFFSET $2;
        `;

        const responseData = await pool.query(query, [queryLimit, Number(offset)]);
        let posts = responseData.rows;
        
        let hasMore = false;
        if (posts.length > limit) {
            hasMore = true;
            posts.pop(); 
        }        
        res.json({
            posts: posts,
            hasMore: hasMore
        });
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
        
        EXISTS (SELECT 1 FROM votes WHERE post_id = posts.id AND user_id = $2) AS liked,

        (posts.user_id = $2) AS is_owner
        
        FROM posts
        JOIN users ON posts.user_id = users.id
        WHERE posts.id = $1;
    `;

    const current_user_id = req.user.id;
    const post_id = req.params.id;

    const responseData = await pool.query(query, [post_id, current_user_id]);
    if(responseData.rows[0].is_deleted == true){
        res.status(403).send("");
    }
    res.json(responseData.rows);
})

router.get('/posts/:id/delete', authMiddleWare, async (req, res) => {
    try {
        const post_id = req.params.id;
        const current_user_id = req.user.id;

        const checkOwnerQuery = `SELECT user_id FROM posts WHERE id=$1;`;
        const responseData = await pool.query(checkOwnerQuery, [post_id]);
        
        if (responseData.rowCount === 0) return res.status(404).send("Post not found");

        let userId = responseData.rows[0].user_id;
  
        if (Number(userId) !== Number(current_user_id)) {
            return res.status(403).send("Not authorized");
        }    
        const softDeleteQuery = `
            UPDATE posts 
            SET is_deleted = true 
            WHERE id = $1 AND user_id = $2;
        `;
        await pool.query(softDeleteQuery, [post_id, current_user_id]);

        const deleteVotesQuery = `
            DELETE FROM commentsvotes
            WHERE comment_id IN (
                SELECT id FROM comments WHERE post_id = $1
            );
        `;
        await pool.query(deleteVotesQuery, [post_id]);

        const deleteCommentsQuery = `
            DELETE FROM comments
            WHERE post_id = $1;
        `;
        await pool.query(deleteCommentsQuery, [post_id]);

        res.status(200).send("Post and all associated comments/votes deleted.");

    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).send("Internal Server Error");
    }
});



module.exports = router;