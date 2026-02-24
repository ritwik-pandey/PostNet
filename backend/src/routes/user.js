const express = require('express')
const pool = require('../db/db')
const router = express.Router();
const authMiddleWare = require('../middleware/auth')

router.get('/user/:id', authMiddleWare, async (req,res) => {
    const id = req.params.id;
    const user_id = req.user.id;
    const query = `
        SELECT 
            u.id, 
            u.name,
            (SELECT COUNT(*) FROM posts WHERE user_id = u.id) AS total_posts,
            (SELECT COUNT(*) FROM follows WHERE following_id = u.id) AS total_followers,
            (SELECT COUNT(*) FROM follows WHERE follower_id = u.id) AS total_following,
            (SELECT COUNT(*) FROM follows WHERE follower_id = $2 AND following_id = u.id) AS follows
        FROM users u
        WHERE u.id = $1; 
        `;
    let responseData = await pool.query(query,[id,user_id]);
    const jsonData = responseData.rows[0];    
    if(Number(id) === req.user.id){
        jsonData["Self"] = true;
    }else{
        jsonData["Self"] = false;
    }    
    res.send(jsonData);
})

router.get('/user/:id/posts', authMiddleWare, async (req,res) => {
    const id = req.params.id;
    const query=`
        SELECT *
        FROM posts
        WHERE user_id = $1;
    `

    const responseData = await pool.query(query,[id]);
    res.send(responseData.rows);
    
})

router.post('/user/:id/follow', authMiddleWare,async (req,res) => {
    const id = req.params.id;
    const user_id = req.user.id;
    if(id == user_id){
        res.send("");
    }
    const query = `
        SELECT *
        FROM follows
        WHERE follower_id=$1 AND following_id=$2
    `
    const responseData = await pool.query(query,[user_id,id]);
    let data="";
    if(responseData.rows[0] == undefined){
        const query2 = `
            INSERT INTO follows (follower_id, following_id)
            VALUES ($1,$2)
        `        
        await pool.query(query2,[user_id,id]);
        data="Follow"
    }else{
        const query2 = `
            DELETE FROM follows
            WHERE follower_id=$1 AND following_id=$2
        `        
        await pool.query(query2,[user_id,id]);
        data="Unfollow"
    }
    const query2 = `
        SELECT COUNT(*) AS f 
        FROM follows 
        WHERE following_id = $1;
        `;
    const ans = await pool.query(query2,[id])
    let count = ans.rows[0];
    
    const jsonFull = JSON.stringify({ action: data, followers: count.f }); 
    res.send(jsonFull);
    
})

router.get('/', authMiddleWare, async (req,res) => {
    const id = req.user.id;
    const feedQuery = `
  SELECT 
    p.id, 
    p.title, 
    p.content, 
    p.created_at,
    u.name AS author_name
  FROM posts p
  JOIN follows f ON p.user_id = f.following_id
  JOIN users u ON p.user_id = u.id
  WHERE f.follower_id = $1
  ORDER BY p.created_at DESC;
`;
    const responseData = await pool.query(feedQuery,[id]);
    res.send(responseData.rows);
    
})

module.exports = router;