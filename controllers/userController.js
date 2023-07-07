const Trade = require('../models/trade');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');
const {body, validationResult} = require('express-validator');
const rateLimit = require('express-rate-limit');


exports.signupGet = (req, res) => {
    res.render('signup');
};

exports.signupPost = [
    body('email')
        .isEmail().withMessage('Please enter a valid email.')
        .normalizeEmail(),
    // body('firstName')
    //     .trim().escape(),
    // body('lastName')
    //     .trim().escape(),
    body('password')
        .isLength({min: 5, max: 64}).withMessage('Password must be between 5 and 64 characters.'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('error_msg', errors.array()[0].msg);
            return res.redirect('back');
        }

        const {email, password, firstName, lastName} = req.body;

        try {
            const existingUser = await User.findOne({email});

            if (existingUser) {
                req.flash('error_msg', 'A user with this email already exists.');
                return res.redirect('back');
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new User({
                firstName,
                lastName,
                email,
                password: hashedPassword,
            });

            await user.save();
            req.login(user, (err) => {
                if (err) return res.status(500).send('Error in login after signup');
                return res.redirect('/users/profile');
            });
        } catch (err) {
            console.error(err);
            req.flash('error_msg', 'An error occurred during sign up.');
            res.redirect('back');
        }
    }
];

exports.loginGet = (req, res) => {
    res.render('login');
};

const loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 3, // 3 attempts allowed
    message: 'Too many failed login attempts, please try again in 5 minutes.',
});

exports.validateLoginPost = [
    body('email')
        .isEmail().withMessage('Please enter a valid email.')
        .normalizeEmail(),
    body('password')
        .isLength({min: 5, max: 64}).withMessage('Password must be between 5 and 64 characters.')
];

exports.loginPost = [loginLimiter];

exports.profile = async (req, res) => {
    if (!req.user) return res.redirect('/users/login');

    try {
        const trades = await Trade.find({user: req.user._id}); // Fetch trades related to the user
        const user = await User.findById(req.user._id).populate({path: 'watchlist', populate: {path: 'user'}});
        res.render('profile', {user: user, trades: trades, watchlist: user.watchlist});
    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'An error occurred while fetching your profile.');
        res.redirect('/users/login');
    }
};

exports.logout = (req, res) => {
    req.logout(() => {
        req.session.destroy(err => {
            if (err) {
                console.error('Error while logging out:', err);
                return res.status(500).send('Error logging out');
            }
            res.clearCookie('connect.sid');
            res.redirect('/users/login');
        });
    });
};
