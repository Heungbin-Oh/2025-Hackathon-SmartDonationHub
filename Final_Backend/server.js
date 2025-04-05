const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const serverless = require('serverless-http');
require('dotenv').config();

const app = express();

const corsOptions = {
  origin: [process.env.FRONTEND_URL, 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// MongoDB connection
let cachedDb = null;

const connectDB = async () => {
  if (cachedDb) {
    console.log('Using cached database connection');
    return cachedDb;
  }

  try {
    console.log('Creating new database connection');
    const client = await mongoose.connect(process.env.SECRET_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    
    cachedDb = client;
    console.log('New database connection established');
    return cachedDb;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Modify the middleware to be more efficient
app.use(async (req, res, next) => {
  try {
    if (!cachedDb) {
      await connectDB();
    }
    next();
  } catch (error) {
    console.error('Database middleware error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Routes
const homeRoutes = require('./Routes/home');
const charityRoutes = require('./Routes/charityRoutes');

app.use('/', homeRoutes);
app.use('/api/charities', charityRoutes);

app.get('/api/health', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    res.json({
      status: 'ok',
      database: states[dbState],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// For serverless deployment
module.exports = serverless(app);
