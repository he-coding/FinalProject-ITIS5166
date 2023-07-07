const express = require('express');
const controller = require('../controllers/mainController');
const router = express.Router();

router.get('/', controller.index);
router.get('/about-trades', controller.about); // changed the route pattern to /about-trades
router.get('/contact', controller.contact);
module.exports = router;
