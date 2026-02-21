const jwt = require('jsonwebtoken')

const authMiddleWare = (req,res,next) => {
    const token = req.cookies.jwtToken;
    
    if(!token){   
        console.log("hello");
                     
        return res.status(400).send("");
    }

    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next()
    }catch{
        res.clearCookie('jwtToken');
        
        return res.status(400);
    }
}

module.exports = authMiddleWare;