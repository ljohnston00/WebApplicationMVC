const { fileUpload, fileEdit } = require('../middleware/fileUpload');
const model = require('../models/event');
const User = require('../models/user');
const RSVP = require('../models/rsvp');
const {profile} = require('../controllers/userController');
exports.index = (req, res)=>{
    //res.send(model.find());\
    let firstName = req.session.firstName;
    model.find()
    .then(events=>res.render('./event/index', {events, firstName}))
    .catch(err=>next(err));
};

exports.about = (req, res)=>{
    let firstName = req.session.firstName;
    res.render('about', {firstName});
};

exports.contact = (req, res) =>{
    let firstName = req.session.firstName;
    res.render('contact', {firstName});
};

exports.new = (req, res) =>{
    let firstName = req.session.firstName;
    res.render('./event/new', {firstName});
};

exports.create = (req, res)=>{
    let firstName = req.session.firstName;
   fileUpload.fileUpload(req, res);
};

exports.show = (req, res, next)=>{
    let id = req.params.id;
    let firstName = req.session.firstName;
    model.findById(id).populate('author', 'firstName lastName')
    .then(event=>{
        if(event){
            RSVP.find({ event: id, status: 'YES' })
            .then(rsvps => {
                return res.render('./event/show', {event, firstName, rsvpCount: rsvps.length});
            })
            .catch(err=>next(err));
        }else {
            let err = new Error('Cannot find a event with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

exports.edit =  (req, res, next)=>{
    let id = req.params.id;
    let firstName = req.session.firstName;
    model.findById(id)
    .then(event=>{
        if(event){
            let start = new Date(event.end).toISOString().substring(0, 16);
            let end = new Date(event.end).toISOString().substring(0, 16);
            res.render('./event/edit', {event: event, start: start, end: end, firstName});
    }else{
        let err = new Error('Cannot find a event with id ' + id);
        err.status = 404;
        next(err);
    }
    })
    .catch(err=>next(err));
};

exports.update = (req, res, next)=>{
    let event = req.body;
    let id = req.params.id;

    fileEdit.fileEdit(req, res, next);
};

exports.rsvp = (req, res, next)=>{
    let id = req.params.id;
    const status = req.body.rsvp;
    let firstName = req.session.firstName;
    RSVP.findOneAndUpdate({ user: req.session.user, event: req.params.id },{ status: status },{ new: true, upsert: true })
    .then(rsvp => {
        
        if (status === 'YES') {
            model.findByIdAndUpdate(
                req.params.id,
                { $inc: { rsvpCount: 1 } },
                { new: true }
            )
            .then(() => {
                req.flash('success', 'Successfuly RSVPed for the Event!');
                res.redirect('/users/profile');
            })
            .catch(err=>{
                console.log(err);
                next(err);
            });
        } else {
            model.findById(req.params.id)
            .then( () => {
                RSVP.find({ event: id, status: 'YES' })
                .then(rsvps => {
                    req.flash('success', 'Successfuly RSVPed for the Event!');
                    res.redirect('/users/profile');
                })
                .catch(err=>next(err));
            })
            .catch(err=>next(err));
        }
    })
    .catch(err=>next(err));
};



exports.delete =  (req, res, next)=>{
    let id = req.params.id;

    model.findByIdAndDelete(id, {useFindAndModify: false})
    .then(event =>{
        if(event){

            RSVP.deleteMany({ event: id })
            .then(() => {
            req.flash('success', 'Event successfuly deleted!');
            res.redirect('/events');
            })
            .catch(err=>next(err));
        }else{
        let err = new Error('Cannot find a event with id ' + id);
        err.status = 404;
        next(err);
        }
    })
    .catch(err=>next(err));
};