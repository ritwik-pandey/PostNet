const express = require('express');
const pool = require('../db/db')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();


router.post('/', async (req,res) => {
  const email = req.body.email;
  const password = req.body.password;

  const query = `SELECT * from users WHERE email LIKE $1`;
  const result = await pool.query(query,[email]);
  const data = result.rows[0];
  if(data === undefined){
    res.status(400).send("False");
  }else if(await bcrypt.compare(password, data.password)){
    const secretKey = process.env.JWT_SECRET;
    const payload = {
      email: email,
      name: data.name,
      id: data.id
    };
    const token = jwt.sign(payload, secretKey, {
      expiresIn: '1h'
    });
    

  res.cookie('jwtToken', token, {
      httpOnly: true, 
      
      maxAge: 3600000, 
    });
    res.status(200).json({ 
      message: 'Login successful', 
    });
  }else{
    res.status(400).send("False");
  }
  
})

module.exports = router;