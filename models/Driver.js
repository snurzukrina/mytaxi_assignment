const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  earnings: { type: Number, default: 0 }
});

module.exports = mongoose.model('Driver', driverSchema);