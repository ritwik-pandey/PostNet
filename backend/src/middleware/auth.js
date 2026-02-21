const jwt = require('jsonwebtoken')

const authMiddleWare = (req,res,next) => {
    const token = req.cookies.jwtToken;
    console.log(req.cookies);
    
    if(!token){        
        return res.status(400);
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