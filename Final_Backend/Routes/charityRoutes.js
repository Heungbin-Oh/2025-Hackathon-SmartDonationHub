const express = require('express');
const router = express.Router();
const charityController = require('../Controller/charityController');


router.post('/', charityController.submitCharity);
router.get('/', charityController.getCharities);

module.exports = router;