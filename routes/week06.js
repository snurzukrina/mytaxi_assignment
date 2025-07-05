// routes/week06.js
const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let db;

// Connect to shared MongoDB Atlas
async function connectDB() {
  if (db) return db;
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    db = client.db('week06db'); // You can change the name if needed
    console.log('✅ Week06 connected to MongoDB');
  } catch (err) {
    console.error('❌ Week06 MongoDB connection error:', err);
  }
}
connectDB();

// JWT Middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
};

// ✅ TEST ROUTE
router.get('/', (req, res) => {
  res.send('✅ Week06 route is working on Azure!');
});

// --------------------- AUTH ROUTES ---------------------

// Register User
router.post('/users', async (req, res) => {
  try {
    await connectDB();
    const { email, password, role } = req.body;
    const userRole = role || 'user';

    const existing = await db.collection('users').findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { email, password: hashedPassword, role: userRole };
    await db.collection('users').insertOne(user);

    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(400).json({ error: 'Registration failed' });
  }
});

// Login User
router.post('/auth/login', async (req, res) => {
  try {
    await connectDB();
    const { email, password } = req.body;

    const user = await db.collection('users').findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Admin: View Users
router.get('/admin/users', authenticate, authorize(['admin']), async (req, res) => {
  try {
    await connectDB();
    const users = await db.collection('users').find().toArray();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

// Admin: Delete User
router.delete('/admin/users/:id', authenticate, authorize(['admin', 'driver']), async (req, res) => {
  try {
    await connectDB();
    const userId = req.params.id;
    const result = await db.collection('users').deleteOne({ _id: new ObjectId(userId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;