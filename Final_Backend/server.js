// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const serverless = require('serverless-http');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB connection
let cachedDb = null;
async function connectDB() {
  if (cachedDb) return cachedDb;
  cachedDb = await mongoose.connect(process.env.SECRET_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return cachedDb;
}

// Connect on request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: 'DB connection error' });
  }
});

// Routes
app.use('/api/charities', require('./Routes/charityRoutes'));
app.use('/', require('./Routes/home'));

// Export for serverless
module.exports = serverless(app);
