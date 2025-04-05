const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const serverless = require('serverless-http'); 
require('dotenv').config();

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// MongoDB connection
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(process.env.SECRET_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  isConnected = true;
};

// Use a middleware to ensure DB is connected before handling any request
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Routes
const homeRoutes = require('./Routes/home');
const charityRoutes = require('./Routes/charityRoutes');

app.use('/', homeRoutes);
app.use('/api/charities', charityRoutes);


module.exports = serverless(app);
