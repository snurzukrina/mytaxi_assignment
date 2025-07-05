const express = require('express');
const router = express.Router();
const { Passenger, Driver, Ride, Rating, Admin } = require('../models'); // ✅ include Admin model

// ✅ Test route
router.get('/', (req, res) => {
  res.send('✅ Week04 route is working on Azure!');
});

// --------------------- PASSENGER Routes ---------------------

// Register Passenger
router.post('/passengers/register', async (req, res) => {
  try {
    const passenger = await Passenger.create(req.body);
    res.status(201).json(passenger);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Passenger Login
router.post('/auth/passenger', async (req, res) => {
  const { email, password } = req.body;
  const found = await Passenger.findOne({ email, password });
  found ? res.status(200).json(found) : res.status(401).json({ error: 'Unauthorized' });
});

// View Passenger Bookings
router.get('/passengers/:id/bookings', async (req, res) => {
  try {
    const bookings = await Ride.find({ passengerId: req.params.id });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// --------------------- RIDE Routes ---------------------

// Book a Ride
router.post('/rides', async (req, res) => {
  try {
    const ride = await Ride.create({ ...req.body, status: 'booked' });
    res.status(201).json(ride);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Cancel Ride
router.delete('/rides/:id', async (req, res) => {
  const result = await Ride.findByIdAndDelete(req.params.id);
  result ? res.sendStatus(204) : res.status(404).json({ error: 'Ride not found' });
});

// Rate Driver
router.post('/rides/:id/rating', async (req, res) => {
  const ride = await Ride.findById(req.params.id);
  if (ride) {
    await Rating.create({ rideId: ride._id, rating: req.body.rating });
    res.status(200).json({ message: 'Driver rated' });
  } else {
    res.status(400).json({ error: 'Ride not found' });
  }
});

// Accept Ride (by driver)
router.patch('/rides/:id/accept', async (req, res) => {
  const ride = await Ride.findById(req.params.id);
  if (ride) {
    ride.status = 'accepted';
    await ride.save();
    res.status(200).json(ride);
  } else {
    res.status(403).json({ error: 'Ride not found' });
  }
});

// Complete Ride (by driver)
router.patch('/rides/:id/complete', async (req, res) => {
  const ride = await Ride.findById(req.params.id);
  if (ride) {
    ride.status = 'completed';
    await ride.save();
    const driver = await Driver.findById(ride.driverId);
    if (driver) {
      driver.earnings += ride.fare || 10;
      await driver.save();
    }
    res.status(200).json(ride);
  } else {
    res.status(404).json({ error: 'Ride not found' });
  }
});

// --------------------- DRIVER Routes ---------------------

// Register Driver
router.post('/drivers/register', async (req, res) => {
  try {
    const driver = await Driver.create({ ...req.body, earnings: 0 });
    res.status(201).json(driver);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Driver Login
router.post('/auth/driver', async (req, res) => {
  const { email, password } = req.body;
  const found = await Driver.findOne({ email, password });
  found ? res.status(200).json(found) : res.status(401).json({ error: 'Unauthorized' });
});

// View Driver Earnings
router.get('/drivers/:id/earnings', async (req, res) => {
  const driver = await Driver.findById(req.params.id);
  driver
    ? res.status(200).json({ earnings: driver.earnings })
    : res.status(404).json({ error: 'Driver not found' });
});

// --------------------- ADMIN Routes ---------------------

// Admin Login
router.post('/auth/admin', async (req, res) => {
  const { email, password } = req.body;
  const found = await Admin.findOne({ email, password });
  found ? res.status(200).json(found) : res.status(401).json({ error: 'Unauthorized' });
});

// View all users
router.get('/admin/users', async (req, res) => {
  const passengers = await Passenger.find();
  const drivers = await Driver.find();
  res.status(200).json({ passengers, drivers });
});

// View all bookings
router.get('/admin/bookings', async (req, res) => {
  const rides = await Ride.find();
  res.status(200).json(rides);
});

// Generate system report
router.get('/admin/reports', async (req, res) => {
  const passengers = await Passenger.countDocuments();
  const drivers = await Driver.countDocuments();
  const rides = await Ride.find();
  const earnings = await Driver.find().then(list =>
    list.reduce((sum, d) => sum + (d.earnings || 0), 0)
  );

  res.status(200).json({
    totalPassengers: passengers,
    totalDrivers: drivers,
    totalRides: rides.length,
    totalEarnings: earnings
  });
});

module.exports = router;