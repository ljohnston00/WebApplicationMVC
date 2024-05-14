const express = require('express');
const controller = require('../controllers/userController');
const {checkGuest, checkLoggedIn} = require('../middleware/auth');
const {validateSignUp, validateLogIn, validateResult} = require('../middleware/validator');
const {logInLimiter} = require('../middleware/rateLimiters');



const router = express.Router();

//GET /users/new: send html form for creating a new user account
router.get('/new', checkGuest, controller.new);

//POST /users: create a new user account
router.post('/', checkGuest, validateSignUp, validateResult, controller.create);

//GET /users/login: send html for logging in
router.get('/login', checkGuest, controller.getUserLogin);

//POST /users/login: authenticate user's login
router.post('/login', logInLimiter, checkGuest, validateLogIn, validateResult, controller.login);

//GET /users/profile: send user's profile page
router.get('/profile', checkLoggedIn, controller.profile);

//POST /users/logout: logout a user
router.get('/logout', checkLoggedIn, controller.logout);

module.exports = router;