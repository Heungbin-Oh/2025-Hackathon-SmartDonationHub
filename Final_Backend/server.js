// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const serverless = require('serverless-http');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB connection
let cachedDb = null;
async function connectDB() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    console.log('Using existing connection');
    return cachedDb;
  }

  console.log('Creating new connection');
  try {
    const conn = await mongoose.connect(process.env.SECRET_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      keepAlive: true,
      maxPoolSize: 50
    });
    
    cachedDb = conn;
    console.log('MongoDB Connected');
    return cachedDb;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    mongoStatus: mongoose.connection.readyState
  });
});

// Connect DB before routes
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB Connection Error:', err);
    res.status(500).json({ 
      error: 'Database connection failed',
      details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

// Routes with error handling
app.use('/api/charities', async (req, res, next) => {
  try {
    await require('./Routes/charityRoutes')(req, res, next);
  } catch (error) {
    console.error('Charity route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use('/', async (req, res, next) => {
  try {
    await require('./Routes/home')(req, res, next);
  } catch (error) {
    console.error('Home route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Export handler
const handler = serverless(app);
module.exports = handler;
