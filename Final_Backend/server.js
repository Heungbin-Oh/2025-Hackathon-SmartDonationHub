const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const serverless = require('serverless-http');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
