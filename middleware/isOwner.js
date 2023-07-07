// middleware/isOwner.js
const Trade = require('../models/trade');

async function isOwner(req, res, next) {
    try {
        const trade = await Trade.findById(req.params.id);
        if (trade.user.equals(req.user._id)) {
            return next();
        }
        res.status(401).send('Unauthorized: You do not have permission to modify this trade.');
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}

module.exports = isOwner;
