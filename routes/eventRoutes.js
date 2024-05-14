const express = require('express');
const controller = require('../controllers/eventController');
const fileUpload  = require('../middleware/fileUpload');
const fileEdit = require('../middleware/fileUpload');
const {checkLoggedIn, checkAuthor, checkNotAuthor} = require('../middleware/auth');
const {validateId, validateEvent, validateRSVP, validateResultE} = require('../middleware/validator');

const router = express.Router();

//Get about page
router.get('/about', controller.about);

//Get contact page
router.get('/contact', controller.contact);

//Get /events: send all events to the user

router.get('/', controller.index);

//GET /events/new: send html form for creating a new event

router.get('/new', checkLoggedIn, controller.new);

//POST /events: create a new event

router.post('/', checkLoggedIn, validateEvent, validateResultE, fileUpload.fileUpload, controller.create);

//GET /events/:id send details of event identified by id

router.get('/:id', validateId, controller.show);

//GET /events/:id/edit: send html form for editing an existing event

router.get('/:id/edit', validateId, checkLoggedIn, checkAuthor, controller.edit);


//PUT /events/:id: update the event identified by id
router.put('/:id', validateId, checkLoggedIn, checkAuthor, validateEvent, validateResultE, fileEdit.fileEdit, controller.update);


//DELETE /events/:id, delete the event identified by id
router.delete('/:id', validateId, checkLoggedIn, checkAuthor, controller.delete);

//POST /events/:id/rsvp, rsvp button click on show page and identifies event by id
router.post('/:id/rsvp', validateId, checkLoggedIn, checkNotAuthor, validateRSVP, validateResultE, controller.rsvp);


module.exports = router;