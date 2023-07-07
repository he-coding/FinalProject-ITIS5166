const Trade = require('../models/trade'); // Import the Trade model
const mongoose = require('mongoose'); // Import mongoose
const User = require('../models/user'); // Import the User model

exports.index = async (req, res) => {
    try {
        let trades = await Trade.find().populate('user', 'firstName lastName');
        let categories = await Trade.distinct('category');
        res.render('./trades', { trades: trades, categories: categories, currentUser: req.user, userWatchlist: req.user ? req.user.watchlist : [] });
    } catch (error) {
        console.log(error);
        req.flash('error', 'There was a problem fetching trades.');
        res.redirect('/');
    }
};
exports.new = (req, res) => {
    res.render('./newTrade');
};
exports.create = async (req, res) => {
    let trade = {
        name: req.body.name,
        category: req.body.category,
        details: req.body.details,
        image: req.body.image,
        user: req.user._id
    };

    try {
        await Trade.create(trade);
        req.flash('success_msg', 'Trade created successfully.');
        res.redirect('/trades');
    } catch (error) {
        console.error('Error:', error); // Debugging statement
        if (error.name === 'ValidationError') {
            req.flash('error_msg', 'Validation error: please provide valid data.');
        } else {
            req.flash('error_msg', 'An error occurred while creating the trade.');
        }
        res.redirect('back');
    }
};
exports.show = async (req, res, next) => {
    let id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Invalid ObjectId');
    }

    try {
        let trade = await Trade.findById(id).populate('user', 'firstName lastName'); // Add .populate() here
        console.log('Trade:', trade); // Debugging statement
        if (trade) {
            res.render('./trade', {trade});
        } else {
            let err = new Error('Cannot find an item with id ' + id);
            err.status = 404;
            next(err);
        }
    } catch (error) {
        console.log('Error:', error); // Debugging statement
        res.status(500).send('Internal Server Error');
    }
};
exports.edit = async (req, res, next) => {
    let id = req.params.id;

    try {
        let trade = await Trade.findById(id);
        if (trade) {
            res.render('./editTrade', {trade});
        } else {
            let err = new Error('Cannot find an item with id ' + id);
            err.status = 404;
            next(err);
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
};
exports.update = async (req, res, next) => {
    let trade = req.body;
    let id = req.params.id;

    try {
        let updatedTrade = await Trade.findByIdAndUpdate(id, trade, { new: true, runValidators: true });
        if (updatedTrade) {
            res.redirect('/trades/' + id);
        } else {
            let err = new Error('Cannot find an item with id ' + id);
            err.status = 404;
            next(err);
        }
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400).send('Validation Error: ' + error.message);
        } else {
            res.status(500).send('Internal Server Error');
        }
    }
};
exports.delete = async (req, res, next) => {
    let id = req.params.id;

    try {
        let deletedTrade = await Trade.findByIdAndDelete(id);
        if (deletedTrade) {
            res.redirect('/trades');
        } else {
            let err = new Error('Cannot find an item with id ' + id);
            err.status = 404;
            next(err);
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
};
// Create a new trade offer for the trade item with the given id
exports.createOffer = async (req, res) => {
    try {
        const tradeItem = await Trade.findById(req.params.id);
        if (!tradeItem) {
            req.flash('error_msg', 'Trade item not found');
            return res.redirect('/trades');
        }
        const offer = {
            offeredBy: req.user._id,
            offeredItem: req.body.offeredItemId // You'll need to pass the ID of the offered item in the request body
        };
        tradeItem.offers.push(offer);
        await tradeItem.save();
        req.flash('success_msg', 'Trade offer successfully created');
        res.redirect(`/trades/${req.params.id}`);
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error creating trade offer');
        res.redirect('/trades');
    }
};
// Update the trade offer for the trade item with the given id (to accept, reject, or cancel the offer)
exports.updateOffer = async (req, res) => {
    try {
        const tradeItem = await Trade.findById(req.params.id);
        if (!tradeItem) {
            req.flash('error_msg', 'Trade item not found');
            return res.redirect('/trades');
        }
        const offer = tradeItem.offers.id(req.params.offerId); // You'll need to pass the offer ID in the request params
        if (!offer) {
            req.flash('error_msg', 'Trade offer not found');
            return res.redirect('/trades');
        }
        offer.offerStatus = req.body.offerStatus; // You'll need to pass the new status ('traded', 'canceled') in the request body
        await tradeItem.save();
        req.flash('success_msg', 'Trade offer successfully updated');
        res.redirect(`/trades/${req.params.id}`);
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error updating trade offer');
        res.redirect('/trades');
    }
};
exports.deleteOffer = async (req, res) => {
    try {
        const tradeItem = await Trade.findById(req.params.id);
        if (!tradeItem) {
            req.flash('error_msg', 'Trade item not found');
            return res.redirect('/trades');
        }
        tradeItem.offers.id(req.params.offerId).remove(); // You'll need to pass the offer ID in the request params
        await tradeItem.save();
        req.flash('success_msg', 'Trade offer successfully deleted');
        res.redirect(`/trades/${req.params.id}`);
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error deleting trade offer');
        res.redirect('/trades');
    }
};
exports.selectOfferItem = async (req, res, next) => {
    try {
        const tradeId = req.params.id;
        const trade = await Trade.findById(tradeId).populate('user', 'firstName lastName');
        if (!trade) {
            let err = new Error('Cannot find an item with id ' + tradeId);
            err.status = 404;
            return next(err);
        }
        // Use Trade.find to fetch the user's items
        const userItems = await Trade.find({ user: req.user._id });
        res.render('selectOfferItem', { trade, userItems });
    } catch (error) {
        console.log('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};
exports.acceptOffer = async (req, res) => {
    try {
        const trade = await Trade.findById(req.params.tradeId);
        const offer = trade.offers.id(req.params.offerId);
        if (!trade || !offer) {
            req.flash('error_msg', 'Trade or offer not found');
            return res.redirect('/users/profile');
        }
        // Find the offered item and update the user field
        const offeredItem = await Trade.findById(offer.offeredItem);
        if (!offeredItem) {
            req.flash('error_msg', 'Offered item not found');
            return res.redirect('/users/profile');
        }
        // Swap the owners of the trade item and the offered item
        const tradeOwner = trade.user;
        const offeredItemOwner = offeredItem.user;
        trade.user = offeredItemOwner;
        offeredItem.user = tradeOwner;
        // Update the trade and offered item in the database
        await trade.save();
        await offeredItem.save();

        trade.status = 'traded';
        trade.tradeStatus = 'Accepted';
        trade.tradeOffer = {
            status: 'Accepted',
            offeredBy: offer.offeredBy,
            offeredItem: offer.offeredItem
        };
        await trade.save();

        req.flash('success_msg', 'Offer accepted');
        res.redirect('/users/profile');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error accepting offer');
        res.redirect('/users/profile');
    }
};
exports.declineOffer = async (req, res) => {
    try {
        const updatedTrade = await Trade.findOneAndUpdate(
            { _id: req.params.tradeId, 'offers._id': req.params.offerId },
            { $pull: { offers: { _id: req.params.offerId } } },
            { new: true }
        );

        if (!updatedTrade) {
            req.flash('error_msg', 'Trade or offer not found');
            return res.redirect('/users/profile');
        }

        req.flash('success_msg', 'Offer declined');
        res.redirect('/users/profile');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error declining offer');
        res.redirect('/users/profile');
    }
};
exports.addToWatchlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const trade = await Trade.findById(req.params.tradeId);

        if (!user || !trade) {
            req.flash('error_msg', 'User or trade not found');
            return res.redirect('/trades');
        }

        if (!user.watchlist.includes(req.params.tradeId)) {
            user.watchlist.push(req.params.tradeId);
            await user.save();
            req.flash('success_msg', 'Item added to watchlist');
        } else {
            req.flash('error_msg', 'Item already in watchlist');
        }

        res.redirect('/trades');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error adding item to watchlist');
        res.redirect('/trades');
    }
};
exports.removeFromWatchlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const trade = await Trade.findById(req.params.tradeId);

        if (!user || !trade) {
            req.flash('error_msg', 'User or trade not found');
            return res.redirect('/trades');
        }

        user.watchlist.pull(req.params.tradeId);
        await user.save();

        req.flash('success_msg', 'Item removed from watchlist');
        res.redirect('/trades');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error removing item from watchlist');
        res.redirect('/trades');
    }
};





