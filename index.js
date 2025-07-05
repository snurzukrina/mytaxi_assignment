const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB connected from index.js");
})
.catch((err) => {
  console.error("❌ MongoDB connection failed:", err.message);
  process.exit(1);
});

app.use('/week04', require('./routes/week04'));
app.use('/week06', require('./routes/week06'));
app.use('/week07', require('./routes/week07'));

app.get('/', (req, res) => {
  res.send("🚀 Welcome to Grab Merged App!");
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});