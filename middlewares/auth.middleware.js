const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

module.exports.authUser = async(req,res,next) => {
    const token = req.cookies.token || req.headers.authorisation?.split(' ')[1];

    if(!token) {
        return res.status(401).json({
            message: 'Unauthorised'
        });
    }
    const isBlacklisted = await userModel.findOne({
        token: token
    })
    if(isBlacklisted) {
        return res.status(401).json({
            message: 'unauthorised'
        });
    }
    //JWT TOKEN LOGIC AND ACCESS IS DEFINED HERE:
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id) //here it is assumed that the decoded userid would contain the "_id" field
        req.user = user; //we are overwriting the req.user with userid decoded from jwt
        return next();
    }
    catch(error) {
        return res.status(401).json({
            message: 'Unauthorised'
        });
    }
}