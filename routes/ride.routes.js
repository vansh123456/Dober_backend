const express = require('express');
const router = express.Router();
const {body,query} = require('express-validator');
const rideController = require('../controllers/ride.controller');
const authMiddleWare = require('../middlewares/auth.middleware');

router.post('/create',authMiddleWare.authUser,body('pickup').isString().isLength({min:3}).withMessage('Invalid Pickup Location'),
body('destination').isString().isLength({min:3}).withMessage('Invalid Destination Location'),
body('vehicleType').isString().isIn(['auto','car','moto']).withMessage('Invalid Vehicle Type'),rideController.createRide);

router.get('/get-fare',authMiddleWare.authUser, query('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
query('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),rideController.getFare)

router.post('/confirm',
    authMiddleWare.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    rideController.confirmRide
);

router.get('/start-ride',
    authMiddleWare.authCaptain,
    query('rideId').isMongoId().withMessage('Invalid ride id'),
    query('otp').isString().isLength({ min: 6, max: 6 }).withMessage('Invalid OTP'),
    rideController.startRide
)

module.exports = router;