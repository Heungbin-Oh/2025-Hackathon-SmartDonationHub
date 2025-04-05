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

// Optimized DB connection
let cachedDb = null;
async function connectDB() {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    const conn = await mongoose.connect(process.env.SECRET_URI, {
      serverSelectionTimeoutMS: 2000,
      socketTimeoutMS: 5000,
      connectTimeoutMS: 2000,
      maxPoolSize: 1
    });
    
    mongoose.connection.on('error', err => {
      console.error('Mongoose connection error:', err);
      cachedDb = null;
    });

    cachedDb = conn;
    return cachedDb;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Health check endpoint - no DB dependency
app.get('/api/health', (_, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/charities', require('./Routes/charityRoutes'));
app.use('/', require('./Routes/home'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({
    error: 'Internal Server Error'
  });
});

// Create handler before DB connection
const handler = serverless(app);

// Initialize DB connection in background
connectDB().catch(console.error);

module.exports = handler;
