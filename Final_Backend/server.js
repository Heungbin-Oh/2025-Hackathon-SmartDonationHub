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
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 3000,
      socketTimeoutMS: 10000,
      connectTimeoutMS: 3000,
      maxPoolSize: 5
    });
    
    // Add connection error handler
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

// Simplified health check endpoint that doesn't wait for DB
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
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

// Initialize DB connection
connectDB().catch(console.error);

// Create and export the serverless handler
const handler = serverless(app);
module.exports = handler;
