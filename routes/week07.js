// routes/week07.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('✅ Week07 MongoDB connected');
    // Wait until db is ready
    waitForConnection().then(() => seedData());
  })
  .catch(err => console.error('❌ Week07 DB error:', err));

// Utility: Wait for mongoose.connection.db to be ready
function waitForConnection() {
  return new Promise(resolve => {
    const check = setInterval(() => {
      if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
        clearInterval(check);
        resolve();
      }
    }, 100);
  });
}

// Seed sample data
async function seedData() {
  try {
    const db = mongoose.connection.db;
    const passengers = db.collection('passengers');
    const rides = db.collection('rides');

    const alice = await passengers.findOne({ name: 'Alice' });
    const bob = await passengers.findOne({ name: 'Bob' });

    if (!alice) {
      await passengers.insertMany([
        {
          _id: new mongoose.Types.ObjectId("666100000000000000000001"),
          name: 'Alice',
          email: 'alice@example.com',
          password: 'hashed_pw'
        },
        {
          _id: new mongoose.Types.ObjectId("666100000000000000000002"),
          name: 'Bob',
          email: 'bob@example.com',
          password: 'hashed_pw'
        }
      ]);
      console.log('✅ Inserted passengers');
    }

    const rideCount = await rides.countDocuments({
      passengerId: {
        $in: [
          new mongoose.Types.ObjectId("666100000000000000000001"),
          new mongoose.Types.ObjectId("666100000000000000000002")
        ]
      }
    });

    if (rideCount === 0) {
      await rides.insertMany([
        {
          _id: new mongoose.Types.ObjectId("666200000000000000000001"),
          passengerId: new mongoose.Types.ObjectId("666100000000000000000001"),
          fare: 12.5,
          pickup: 'Point A',
          destination: 'Point B',
          status: 'completed'
        },
        {
          _id: new mongoose.Types.ObjectId("666200000000000000000002"),
          passengerId: new mongoose.Types.ObjectId("666100000000000000000001"),
          fare: 10,
          pickup: 'Point C',
          destination: 'Point D',
          status: 'completed'
        },
        {
          _id: new mongoose.Types.ObjectId("666200000000000000000003"),
          passengerId: new mongoose.Types.ObjectId("666100000000000000000002"),
          fare: 20,
          pickup: 'Point E',
          destination: 'Point F',
          status: 'completed'
        }
      ]);
      console.log('✅ Inserted rides');
    }
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  }
}

// Analytics API
router.get('/analytics/passengers', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const passengers = db.collection('passengers');

    const result = await passengers.aggregate([
      {
        $lookup: {
          from: 'rides',
          localField: '_id',
          foreignField: 'passengerId',
          as: 'rides'
        }
      },
      { $unwind: '$rides' },
      {
        $group: {
          _id: '$name',
          totalRides: { $sum: 1 },
          totalFare: { $sum: '$rides.fare' }
        }
      },
      {
        $project: {
          name: '$_id',
          totalRides: 1,
          totalFare: 1,
          _id: 0
        }
      }
    ]).toArray();

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Default route
router.get('/', (req, res) => {
  res.send("✅ Week07 route is working on Azure!");
});

module.exports = router;