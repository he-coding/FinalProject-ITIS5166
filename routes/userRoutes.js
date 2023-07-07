const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { ensureAuthenticated } = require('../middleware');
const passport = require('passport');

router.get('/signup', userController.signupGet);
router.post('/signup', userController.signupPost);
router.get('/login', userController.loginGet);
router.post('/login', userController.validateLoginPost, ...userController.loginPost, passport.authenticate('local', {
    successRedirect: '/users/profile',
    failureRedirect: '/users/login',
    failureFlash: true
}));
router.get('/profile', ensureAuthenticated, userController.profile);
router.get('/logout', userController.logout);

module.exports = router;
