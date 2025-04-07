const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectToDatabase = require('./lib/db');
const app = express();
require('dotenv').config();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST'],
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to MongoDB
connectToDatabase()
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB:', err));

// Routes
const homeRoutes = require('./Routes/home');
const charityRoutes = require('./Routes/charityRoutes');

app.use('/', homeRoutes);
app.use('/api/charities', charityRoutes);

app.listen(8080, () => console.log('DB API running on http://localhost:8080'));

module.exports = app;