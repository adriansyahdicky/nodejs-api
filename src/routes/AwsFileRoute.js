const express = require('express');
const router = express.Router();

const AwsFileController = require('../controllers/AwsFileController');

router.get('/image/:key', AwsFileController.getAwsFile);

module.exports = router;
