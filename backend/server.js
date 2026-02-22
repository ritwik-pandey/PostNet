const express = require('express')
require('dotenv').config();

const app = express()
const cors = require('cors'); 
const cookieParser = require('cookie-parser');

const loginRoutes = require('./src/routes/login')
const signupRoutes = require('./src/routes/signup')
const postRoutes = require('./src/routes/post')

const port = 5000

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true,              
}));

app.use(cookieParser()); 

app.use(express.json());


const authMiddleWare = require('./src/middleware/auth')

app.use('/login',loginRoutes);
app.use('/signup',signupRoutes);
app.use('/', postRoutes);

app.get('/dashboard', authMiddleWare,(req, res) => {
  console.log(req.user);
  
  res.send("")
  
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})