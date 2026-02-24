const express = require('express')
const pool = require('../db/db')
const router = express.Router();
const authMiddleWare = require('../middleware/auth')

router.post('/:id/comment', authMiddleWare, async (req,res)=>{
    const content = req.body.content;
    const post_id = req.params.id;
    const user_id = req.user.id;
    const insertQuery = `
    INSERT INTO comments (content,user_id, post_id) 
    VALUES ($1, $2, $3) 
    RETURNING *; 
    `
    const values = [content, user_id, post_id];
    try{
        const responseData = await pool.query(insertQuery,values)
        const jsonContent = JSON.stringify(responseData.rows);
        res.end(jsonContent);
    }catch(e){
        console.log(e);
        res.send("");
    }
    
})

router.get('/posts/:id/comments', authMiddleWare, async (req,res)=>{
    const post_id = req.params.id;
    
    try{
        const query = `SELECT 
            comments.*, 
            users.name AS author_name,
            (
                SELECT COALESCE(SUM(vote_type), 0) 
                FROM commentsvotes 
                WHERE commentsvotes.comment_id = comments.id
            ) AS total_votes
            FROM comments
            JOIN users ON comments.user_id = users.id
            WHERE comments.post_id = ${post_id};`
        const responseData = await pool.query(query)
        const jsonContent = JSON.stringify(responseData.rows);        
        res.end(jsonContent);
    }catch(e){
        console.log(e);
        res.send("");
    }
    
})

router.post('/posts/:id/vote', authMiddleWare, async (req,res)=>{
    
    const content = req.body.voteType;
    const commentId = req.body.commentId;
    const id = req.params.id;
    const user_id = req.user.id;
    let vote = 0;
    let total_votes = req.body.total_votes;
    if(content === "Like"){
        vote++;
    }else{
        vote--;   
    }
    const query = `
            SELECT commentsvotes.vote_type 
            FROM commentsvotes 
            WHERE user_id = ${user_id} AND comment_id = ${commentId};
        `;
    const responseData = await pool.query(query);
    const jsonContent = responseData.rows;
    
    if(jsonContent.length == 0){
        const insertQuery = `
            INSERT INTO commentsvotes (user_id, comment_id,vote_type) 
            VALUES ($1, $2, $3) 
            RETURNING *; 
        `
        const values = [user_id, commentId, vote];
        const resp = await pool.query(insertQuery, values);
        const jC = JSON.stringify(resp.rows);  
        total_votes = Number(total_votes) + Number(vote);
    }else{
        vote=0;
        const query = `DELETE FROM commentsvotes WHERE comment_id=${commentId} AND user_id=${user_id}`
        const responseData = await pool.query(query);
        const result = await pool.query(
            `SELECT COALESCE(SUM(vote_type), 0) AS total_votes FROM commentsvotes WHERE comment_id = $1 `, 
            [commentId]
        );
        total_votes = result.rows[0].total_votes;

    }
    
    res.end(total_votes.toString());
})

router.post('/posts/:id/Postvote', authMiddleWare, async (req,res)=>{
    
    const content = req.body.voteType;
    const id = req.params.id;
    const user_id = req.user.id;
    let total_votes = req.body.total_votes;
    let vote = 0;
    if(content === "Like"){
        vote++;
    }else{
        vote--;   
    }
    const query = `
            SELECT votes.vote_type 
            FROM votes 
            WHERE user_id = ${user_id} AND post_id = ${id};
        `;
    const responseData = await pool.query(query);
    const jsonContent = responseData.rows;
    
    if(jsonContent.length == 0){
        const insertQuery = `
            INSERT INTO votes (user_id, post_id,vote_type) 
            VALUES ($1, $2, $3) 
            RETURNING *; 
        `
        const values = [user_id, id, vote];
        const resp = await pool.query(insertQuery, values);
        const jC = JSON.stringify(resp.rows);   
        total_votes = Number(total_votes) + Number(vote);
    }else{
        vote=0;
        await pool.query(`DELETE FROM votes WHERE post_id = $1 AND user_id = $2`, [id, user_id]);
         const result = await pool.query(
            `SELECT COALESCE(SUM(vote_type), 0) AS total_votes FROM votes WHERE post_id = $1`, 
            [id]
        );
        total_votes = result.rows[0].total_votes;
        
    }
    
    res.end(total_votes.toString());
})
module.exports = router;