
const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');
const blacklistTokenModel = require('../models/blacklistToken.model');

module.exports.registerUser = async (req, res, next) => {
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fullname, email, password, camera, skills, socialLinks, location } = req.body;

        // Check if captain is already registered
        const isCaptainAlreadyRegistered = await captainModel.findOne({ email });
        if (isCaptainAlreadyRegistered) {
            return res.status(400).json({ message: 'Captain already registered' });
        }
        
        // Create new captain
        const captain = new captainModel({
            fullname,
            email,
            password, // No need to hash manually, it will be done in pre-save middleware
            camera,
            skills,
            socialLinks,
            location
        });

        // Save to database
        const savedCaptain = await captain.save();

        // Generate JWT token
        const token = savedCaptain.generateAuthToken();

        res.status(201).json({ token, captain: savedCaptain });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


module.exports.loginCaptain = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find captain and explicitly select the password
        const captain = await captainModel.findOne({ email }).select('+password');

        if (!captain) {
            return res.status(401).json({ message: 'Invalid Email or password' });
        }

        // Compare the entered password with the hashed password
        const isMatch = await captain.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid Email or password' });
        }

        // Generate token
        const token = captain.generateAuthToken();
        res.cookie('token', token, { httpOnly: true });

        res.status(200).json({ token, captain });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};



module.exports.getCaptainProfile = async (req, res, next) => {
    res.status(200).json({ captain: req.captain }); 
}


module.exports.logoutCaptain = async (req, res, next) => {

    const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];
    
    await blacklistTokenModel.create({ token });
    res.clearCookie('token');



    res.status(200).json({ message: 'Captain logged out' });
}