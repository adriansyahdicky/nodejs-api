const express = require('express');
const router = express.Router();

const EmailController = require('../controllers/EmailController');

router.post('/starship', EmailController.upload, EmailController.sendStarship)
router.post('/mission',  EmailController.sendMission);

module.exports = router;
