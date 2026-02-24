const express = require('express');
const pool = require('../db/db')
const router = express.Router();

const bcrypt = require('bcrypt');

const saltRounds = 10;


router.post('/', async (req, res) => {  
  console.log(req.body);
  
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const insertQuery = `
    INSERT INTO users (name, email, password) 
    VALUES ($1, $2, $3) 
    RETURNING *; 
  `;
  const hash = await bcrypt.hash(password, saltRounds);
  const values = [name, email, hash];
  try{
    const res = await pool.query(insertQuery, values);
    console.log(res.rows[0]);    
  }catch(err){
    console.log(err.stack);
  }

  
  res.send("");
})

module.exports = router;