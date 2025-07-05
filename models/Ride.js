const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  passengerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Passenger' },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  status: String, // booked, accepted, completed
  fare: Number
});

module.exports = mongoose.model('Ride', rideSchema);