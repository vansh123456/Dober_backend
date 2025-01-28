const mapService =  require('../services/maps.service');
const {validationResult} = require('express-validator');

module.exports.getDistanceTime = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { origin, destination } = req.query;
        const distanceTime = await mapService.getDistanceTime(origin, destination);
        res.status(200).json(distanceTime);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}
//NOT WORKING AUTOCOMPLETE:CONSOLE SPAM!
// module.exports.getAutoCompleteSuggestions = async (req, res, next) => {
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }
//         const { input } = req.query;
//         const suggestions = await mapService.getAutoCompleteSuggestions(input);
//         res.status(200).json(suggestions);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// }

module.exports.getAutoCompleteSuggestions = async (req, res, next) => {
    try {
        const { input } = req.query;

        // Input validation
        if (!input || typeof input !== 'string' || input.trim().length < 2) {
            return res.status(400).json({ 
                errors: [{ 
                    msg: 'Input must be a string with at least 2 characters',
                    param: 'input',
                    location: 'query'
                }]
            });
        }

        const suggestions = await mapService.getAutoCompleteSuggestions(input.trim());
        res.status(200).json(suggestions);
    } catch (err) {
        console.error('Autocomplete suggestion error:', err);
        
        // Handle specific error types
        if (err.message === 'query is required') {
            return res.status(400).json({ message: 'Input parameter is required' });
        }
        
        res.status(500).json({ 
            message: 'Internal server error',
            error: err.message
        });
    }
}

module.exports.getCoordinates = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { address } = req.query;
    try {
        const coordinates = await mapService.getAddressCoordinate(address);
        res.status(200).json(coordinates);
    } catch (error) {
        res.status(404).json({ message: 'Coordinates not found' });
    }
}