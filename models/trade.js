const mongoose = require('mongoose'); // Import mongoose
// Create Offer schema
const offerSchema = new mongoose.Schema({
    offerStatus: {
        type: String,
        enum: ['offered', 'traded', 'canceled'],
    },
    offeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    offeredItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trade',
        default: null,
    },
});
// Connect to MongoDB
const tradeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    details: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    offers: [offerSchema], // Change "offer" to "offers" and make it an array
});
// Create a model based on the schema
const Trade = mongoose.model('Trade', tradeSchema);
// Export the Trade model
module.exports = Trade;
