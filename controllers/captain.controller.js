const captainModel = require('../models/captain.model')
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');

module.exports.registerCaptain = async(res,req,next) => {
    const errors = validationResult(req); //isme we are sending the validation in captain.routes.js to usme se hoke aaraha hai
    if(!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {fullname,email,password,vehicle} = req.body;
    const isCaptainAlreadyExist = await captainModel.findOne({
        email
    });

    if(isCaptainAlreadyExist) {
        return res.status(400).json({message:
            'Captain Already exist'
        });
    }

    const hashedPassword = await captainModel.hashPassword(password);
    const captain = await captainService.createCaptain({
        firstname:
            fullname.firstname,
        lastname:
            fullname.lastname,
            email,
            password: hashedPassword,
            color: vehicle.color,
            plate: vehicle.plate,
            capacity:
                vehicle.capacity,
            vehicleType:
                vehicle.vehicleType
    });
    
    const token = captain.generateAuthToken();
    res.status(201).json({
        token,captain //returning the details of captain and jwt token generated:
    })

}   