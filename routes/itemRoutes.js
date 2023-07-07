const express = require('express');
const controller = require('../controllers/itemController'); // Revert this line
const isAuthenticated = require('../middleware/isAuthenticated');
const isOwner = require('../middleware/isOwner');
const router = express.Router();
const tradeController = require('../controllers/itemController'); // Revert this line
const { acceptOffer, declineOffer } = require('../controllers/itemController'); // Revert this line
router.get('/:id/select-offer-item', isAuthenticated, controller.selectOfferItem);
router.get('/', controller.index);
router.get('/new', isAuthenticated, controller.new);
router.post('/', isAuthenticated, controller.create);
router.get('/:id', controller.show);
router.get('/:id/edit', isAuthenticated, isOwner, controller.edit); // Add isOwner here
router.put('/:id', isAuthenticated, isOwner, controller.update); // Add isOwner here
router.delete('/:id', isAuthenticated, isOwner, controller.delete); // Add isOwner here
router.post('/:id/offer', isAuthenticated, controller.createOffer);
router.put('/:id/offer/:offerId', isAuthenticated, controller.updateOffer);
router.delete('/:id/offer/:offerId', isAuthenticated, controller.deleteOffer);
router.post('/:id/offers', tradeController.createOffer);
router.post('/:tradeId/offers/:offerId/accept', acceptOffer);
router.post('/:tradeId/offers/:offerId/decline', declineOffer);
router.post('/:tradeId/watchlist/add', isAuthenticated, tradeController.addToWatchlist); // Corrected route
router.post('/:tradeId/watchlist/remove', isAuthenticated, tradeController.removeFromWatchlist); // Corrected route
module.exports = router;
