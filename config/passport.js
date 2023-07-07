const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.use(new LocalStrategy({ usernameField: 'email' }, async function(email, password, done) {
    try {
        let user = await User.findOne({ email: email });
        if (!user) {
            return done(null, false, { message: 'Incorrect email.' });
        }

        let isMatch = await user.comparePassword(password);
        if (isMatch) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'Incorrect password.' });
        }
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    console.log('deserializeUser called with id:', id);
    try {
        const user = await User.findById(id);
        console.log('deserializeUser found user:', user);
        done(null, user);
    } catch (err) {
        console.error('Error in deserializeUser:', err);
        done(err, null);
    }
});

