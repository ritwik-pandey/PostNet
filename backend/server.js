const express = require('express')
const pool = require('./src/db/db')
const app = express()
const bcrypt = require('bcrypt');
const cors = require('cors'); 
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const saltRounds = 10;
const port = 5000

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true,              
}));

app.use(cookieParser()); 

app.use(express.json());

const authMiddleWare = require('./src/middleware/auth')

app.post('/signup', async (req, res) => {  
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

app.post('/login', async (req,res) => {
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
      name: data.name
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

app.get('/dashboard', authMiddleWare,(req, res) => {
  console.log(req.user);
  console.log("Hello");
  
  res.send("")
  
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})