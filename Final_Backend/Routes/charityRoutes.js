const express = require('express');
const router = express.Router();
const charityController = require('../Controller/charityController');

// Add error handling middleware specific to charity routes
router.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ 
      status: 'error',
      message: 'Invalid JSON payload'
    });
  }
  next(err);
});

router.post('/', async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = ['name', 'email', 'address', 'category', 'phone'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    await charityController.submitCharity(req, res);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

router.get('/', charityController.getCharities);

module.exports = router;
