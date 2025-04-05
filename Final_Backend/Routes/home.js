const express = require('express');
const router = express.Router();
const multer = require('multer');
const homeController = require('../Controller/homeController');

const upload = multer();

router.post('/', upload.single('donationImage'), homeController.getForm);

module.exports = router;