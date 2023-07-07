const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'You must be logged in to access this page.');
    res.redirect('/users/login');
};
module.exports = { ensureAuthenticated };
