const {body} = require('express-validator');
const {validationResult} = require('express-validator');

//check if id is valid
exports.validateId = (req, res, next)=>{
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    }else {
        return next();
    }
};

const isEndDateAfterStartDate = (end, start) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
  
    return endDate > startDate;
  };

exports.validateSignUp = [body('firstName', 'First name cannot be empty').notEmpty().trim().escape(),
body('lastName', 'Last name cannot be empty').notEmpty().trim().escape(),
body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be atleast 8 characters and at most 64 characters').isLength({min: 8, max: 64})];


exports.validateLogIn = [body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be atleast 8 characters and at most 64 characters').isLength({min: 8, max: 64})];

exports.validateEvent = [
    // Check if required fields are not empty
    body('category', 'Category cannot be empty').notEmpty().trim().escape(),
    body('title', 'Title cannot be empty').notEmpty().trim().escape(),
    body('content', 'Content must be at least 10 characters long').isLength({ min: 10 }).trim().escape(),
    body('location', 'Location cannot be empty').notEmpty().trim().escape(),
    body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({ min: 8, max: 64 }),
    body('category').isIn(['connecting', 'sports', 'cuisine', 'astronomy', 'other']),
    body('start', 'Start must be a valid ISO 8601 date').isISO8601(),
    body('end', 'End must be a valid ISO 8601 date').isISO8601(),
    body('start').custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Start date must be after today\'s date');
      }
      return true;
    }),
    
    // Check if end is after start
    body('end').custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.start)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
    
    // Check if rsvp status is one of the allowed values
    body('status', 'Must be YES, NO, or MAYBE').isIn(['YES', 'NO', 'MAYBE']),
  ];

exports.validateRSVP = [body('status', 'Must be YES, NO, MAYBE').notEmpty().trim().escape()];

exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);
  
    if(!errors.isEmpty()) {
        errors.array().forEach(error=>{
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    } else {
        return next();
    }
}

exports.validateResultE = (req, res, next) => {
    let errors = validationResult(res);
    if(!errors.isEmpty()) {
        errors.array().forEach(error=>{
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    } else {
        return next();
    }
}