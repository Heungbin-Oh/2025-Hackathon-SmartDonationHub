const Charity = require('../models/Charity');

exports.submitCharity = async (req, res) => {
  try {
    const { name, email, address, category, phone, website } = req.body;
    
    // Basic validation
    if (!name || !email || !address || !category || !phone) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid email format'
      });
    }

    const newCharity = new Charity({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      address: address.trim(),
      category: category.trim(),
      phone: phone.trim(),
      website: website ? website.trim() : undefined
    });

    await newCharity.save();

    res.status(201).json({
      status: 'success',
      message: 'Charity submitted successfully!',
      charity: newCharity
    });
  } catch (error) {
    console.error('Charity submission error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error submitting charity',
      details: error.message
    });
  }
};

exports.getCharitiesByCategory = async (category) => {
  try {
    const charities = await Charity.find({ category: category });
    const uniqueCharities = [];
    const seenEmails = new Set(); 

    for (const charity of charities) {
      if (!seenEmails.has(charity.email)) {
        seenEmails.add(charity.email);
        uniqueCharities.push(charity);
      }
    }

    return uniqueCharities;
  } catch (error) {
    console.error('Error fetching charities by category:', error);
    return false;
  }
};

exports.getCharities = async (req, res) => {
  try {
    console.log('Fetching charities');
    const charities = await Charity.find().lean().exec();
    console.log(`Found ${charities.length} charities`);
    res.status(200).json(charities);
  } catch (error) {
    console.error('Error fetching charities:', error);
    res.status(500).json({ 
      message: 'Error fetching charities',
      error: error.message
    });
  }
};
