const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const {validationResult} = require('express-validator');
const blackListTokenModel = require('../models/blacklistToken.model')

module.exports.registerUser = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const {fullname,email,password} = req.body;

    const isUserAlready = await userModel.findOne({email});
    if(isUserAlready) {
        return res.status(400).json({
            message: 'User Already Exist'
        });
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
        firstname:fullname.firstname, //populate subsidary fields in DB schema
        lastname:fullname.lastname,
        email,
        password:hashedPassword
    });

    const token = user.generateAuthToken();
    res.cookie('token',token) //we are saving the jwt token withing a cookie,not with localstorage
    res.status(201).json({token,user});
}

module.exports.loginUser = async (req,res,next) => {
    const errors =validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const {email,password} = req.body;
    const user = await userModel.findOne({email}).select('+password'); //select does explicitely returns the value of password
    if(!user){
        return res.status(401).json({message: 'Invalid Email or password'});
    }

    const isMatch = await user.comparePassword(password);

    if(!isMatch){
        return res.status(401).json({message: 'Invalid Email or password'});
    }

    const token = user.generateAuthToken();
    res.status(200).json({token,user});
}
module.exports.getUserProfile = async (req,res,next) => {
    res.status(200).json(req.user); //status ALL-OK SEND BACK DATA OF USER
    //req.user is populated by the middleware and info regarding data of user
}
module.exports.logoutUser = async(req,res,next) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorisation.split(' ')[1];
    //idhar we are separating the BEARER AND AUTH TOKEN
    await blackListTokenModel.create({token});
    res.status(200).json({message: 'Logged out successfully'});
}