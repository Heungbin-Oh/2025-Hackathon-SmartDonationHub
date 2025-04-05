const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const serverless = require('serverless-http');
require('dotenv').config();

const app = express();

// Increase the limit for JSON and URL-encoded bodies
app.use(express.json({ limit: '10mb', strict: false }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));

// Add raw body parsing middleware
app.use((req, res, next) => {
  let data = '';
  req.setEncoding('utf8');
  
  req.on('data', chunk => {
    data += chunk;
  });

  req.on('end', () => {
    if (data) {
      try {
        req.rawBody = data;
        req.body = JSON.parse(data);
      } catch (e) {
        // If JSON parsing fails, continue with raw data
        req.rawBody = data;
      }
    }
    next();
  });
});

// DB connection (with basic caching)
let cachedDb = null;
const connectDB = async () => {
  if (cachedDb) return cachedDb;
  cachedDb = await mongoose.connect(process.env.SECRET_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return cachedDb;
};

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ error: 'DB connection error' });
  }
});

// Routes
app.use('/api/charities', require('./Routes/charityRoutes'));
app.use('/', require('./Routes/home'));

// Export for serverless
module.exports = serverless(app);
