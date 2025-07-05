const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  rideId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride' },
  rating: Number
});

module.exports = mongoose.model('Rating', ratingSchema);