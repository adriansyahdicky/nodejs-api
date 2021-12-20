const express = require('express');
const router = express.Router();

const NetworkController = require('../controllers/NetworkController');

router.post('/create', NetworkController.upload, NetworkController.create);
router.get('/list', NetworkController.list);
router.post('/delete', NetworkController.delete);

module.exports = router;
