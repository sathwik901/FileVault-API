const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const verifyAuth = (req, res, next) => {
    const token = req.cookies.JWTtoken;
    if(!token){
        return res.status(401).send("Unauthorized");
    }try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    }catch(error){
        res.status(401).send("Invalid Token");
    }
}

module.exports = verifyAuth;