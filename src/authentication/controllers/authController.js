const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../../models/userModel');
const dotenv = require('dotenv');
dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY;

const register = async (req, res) => {
    const {userName, password, email} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newuser = await userModel.create({userName, email, password: hashedPassword});
    res.send('user created')
}

const login = async (req, res) => {
    const {userName, password} = req.body;
    const user = await userModel.findOne({userName});
    if(!user){
        res.status(401).json({message: 'Invalid userName or password'});
    }

    const isPassMatch = await bcrypt.compare(password, user.password);

    if(!isPassMatch){
        res.status(401).json({message: 'Invalid userName or password'});
    }

    const token = jwt.sign({id: user._id}, secretKey, {expiresIn: '24h'})

    res.cookie('JWTtoken', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
    })

    res.status(200).json({message: 'logged in successfully', token})
}

const logout = async(req, res) => {
    res.clearCookie('JWTtoken', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    })
    res.status(200).json({
        message: "loggedout successfully"
    })
}

module.exports = {register, login, logout};