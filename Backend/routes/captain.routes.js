const captainController = require('../controllers/captain.controller');
const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const authmiddleware = require('../middlewares/auth.middleware');


router.post('/register',[
    body('fullname.lastname').isLength({min:3}).withMessage('Last name must be at least 3 characters long.'),
    body('email').isEmail().withMessage('Please enter a valid email.'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long.'),
    body('camera.cameraType').not().isEmpty().withMessage('Camera type is required'),
    body('skills').isArray().withMessage('Skills must be an array'),
    body('socialLinks.instagram').isURL().withMessage('Please enter a valid URL'),
    body('location.city').not().isEmpty().withMessage('City is required'),
    body('location.state').not().isEmpty().withMessage('State is required'),
    body('location.country').not().isEmpty().withMessage('Country is required'),

],
captainController.registerUser)




router.post('/login',[
    body('email').isEmail().withMessage('Please enter a valid email.'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long.')
],
captainController.loginCaptain
)


router.get('/profile',authmiddleware.authCaptain,captainController.getCaptainProfile)


router.get('/logout',authmiddleware.authCaptain,captainController.logoutCaptain)    


module.exports = router;