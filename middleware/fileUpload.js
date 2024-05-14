const path = require('path');
const multer = require('multer');
const model = require('../models/event');


const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, './public/images')
    },
    filename: (req, file ,cb) => {
        const uniqueSuffix = Date.now() + Math.round(Math.random()+ 1E9);
        cb(null, file.originalname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});


const fileFilter = (req, file, cb) => {
    const mimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    if(mimeTypes.includes(file.mimetype)){
        return cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only jpeg, jpg, png, and gif image files are allowed.'));
    }
}

const upload = multer({
    storage: storage,
    limits:{fileSize: 10*1024*1024},
    fileFilter: fileFilter
}).single('image');

exports.fileUpload = (req, res, next) =>{
    upload(req, res, err => {
        if(err){
            err.status = 400;
            next(err);
        } else {
            let event = new model(req.body);
            event.image = '/images/' + req.file.filename;
            event.author = req.session.user;
            req.flash('success', 'Event successfuly created!');
            event.save()
            .then(res.redirect('/events'))
            .catch(err=>{
                if(err.name === 'ValidationError'){
                    err.status = 400;
                }
                next(err);
            });
        }
    });
}


exports.fileEdit = (req, res, next) =>{
    upload(req, res, err => {
        if(err){
            err.status = 400;
            next(err);
        } else {
            let event = req.body;
            let id = req.params.id;
            if(req.file){
                event.image = '/images/' + req.file.filename;
            }

            model.findByIdAndUpdate(id, event, {useFindAndModify: false, runValidators: true})
            .then(event=>{
                if(event){
                    req.flash('success', 'Event successfuly updated!');
                    res.redirect('/events/'+id);
                   }else{
                    let err = new Error('Cannot find a story with id' + id);
                    err.status = 404;
                    next(err);
                   }
            })
            .catch(err=>{
                console.log(err.message);
                if(err.name === 'ValidationError'){
                    err.status = 400;
                next(err);
                }
            });
        }
    });
}