const mongoose = require('mongoose');

const charitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Charity', charitySchema);