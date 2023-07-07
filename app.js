const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const itemRoutes = require('./routes/itemRoutes');
const mainRoutes = require('./routes/mainRoutes');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
require('./config/passport');
const userRoutes = require('./routes/userRoutes');
const flash = require('connect-flash');
// Connect to MongoDB
mongoose.connect('mongodb://localhost/foodtradesdb', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));

const app = express();
const port = 3000;
let host = 'localhost';
app.set('view engine', 'ejs');
// Middleware to make user information available in all views
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});
// Mount middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));

// Middleware to make flash messages available in all views
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});
// Middleware to make user information available in all views
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});
app.use('/', mainRoutes);
app.use('/trades', itemRoutes);
app.use('/users', userRoutes);
app.use((req, res, next) => {
    let err = new Error('The server cannot locate the requested resource' + req.url);
    err.status = 404;
    next(err);
});
app.use((err, req, res, next) => {
    console.log(err.stack);
    if (!err.status){
        err.status = 500;
        err.message = 'Internal Server Error';
    }
    res.status(err.status);
    res.render('error', {error: err});
});
app.listen(port, host, () => {
    console.log('Server is running on port' + port);
});
