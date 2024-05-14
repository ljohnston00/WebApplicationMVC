const Event = require('../models/event');

//check if user is a guest.
exports.checkGuest = (req, res, next)=>{
    if(!req.session.user){
        return next();
    }else {
        req.flash('error', 'You are logged in already');
        return res.redirect('/users/profile');
    }
};

//checks if the user is authenticated
exports.checkLoggedIn = (req, res, next)=>{
    if(req.session.user){
        return next();
    }else {
        req.flash('error', 'You need to log in first');
        return res.redirect('/users/login');
    }
};

//Checks if the user is the author of the event
exports.checkAuthor = (req, res ,next)=>{
    let id = req.params.id;

    Event.findById(id)
    .then(event=>{
        if(event){
            if(event.author == req.session.user){
                return next();
            } else{
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        } else {
            let err = new Error('Cannot find a event with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};


//Makes sure the user is not the host for the rsvp feature
exports.checkNotAuthor = (req, res ,next)=>{
    let id = req.params.id;

    Event.findById(id)
    .then(event=>{
        if(event){
            if(event.author == req.session.user){
                let err = new Error('The host of an event cannot RSVP for it');
                err.status = 401;
                return next(err);
            } else{
                return next();
            }
        } else {
            let err = new Error('Cannot find a event with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};