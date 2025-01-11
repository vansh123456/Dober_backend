const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const rideController = require('../controllers/ride.controller');
const authMiddleWare = require('../middlewares/auth.middleware');

router.post('/create',authMiddleWare.authUser,body('pickup').isString().isLength({min:3}).withMessage('Invalid Pickup Location'),
body('destination').isString().isLength({min:3}).withMessage('Invalid Destination Location'),
body('vehicleType').isString().isIn(['auto','car','moto']).withMessage('Invalid Vehicle Type'),rideController.createRide);

module.exports = router;