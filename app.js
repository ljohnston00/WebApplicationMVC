const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

let port = 3000;
let host = 'localhost';
let url = 'mongodb+srv://ljohnston1:42Tisf@cluster0.cegv9aa.mongodb.net/'
app.set('view engine', 'ejs');


mongoose.connect(url)
.then(()=>{
//starts the server
app.listen(port, host, ()=>{
    console.log('Server is running on port', port);
});
})
.catch(err=>console.log(err.message));

app.use(
    session({
        secret: "ajfeirf90aeu9eroejfoefj",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongoUrl: 'mongodb+srv://ljohnston2001:7x43b1A!@cluster0.snuaviq.mongodb.net/nbda-project3?retryWrites=true&w=majority'}),
        cookie: {maxAge: 60*60*1000}
        })
);
app.use(flash());

app.use((req, res, next) => {
    res.locals.user = req.session.user||null;
    res.locals.firstName = req.session.firstName || null;
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

app.get('/', (req, res) =>{
    let firstName = req.session.firstName;
    res.render('index', {firstName});
});


app.use('/events', eventRoutes);

app.use('/users', userRoutes);

app.use((req, res, next) =>{
    let err = new Error('the server cannot locate '+ req.url);
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) =>{
    if(!err.status){
        err.status = 500;
        err.message = ("Internal Server Error");
    }
    res.status(err.status);
    res.render('error', {error: err});
});

