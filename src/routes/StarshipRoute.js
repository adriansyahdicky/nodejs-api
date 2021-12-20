const express = require('express');
const router = express.Router();

const StarshipController = require('../controllers/StarshipController');

router.get('/list', StarshipController.listAdmin);
router.get('/list/fe', StarshipController.listFe);
router.post('/create', StarshipController.upload, StarshipController.create);
router.get('/get/:id', StarshipController.get);
router.post(
  '/update/:id',
  StarshipController.upload,
  StarshipController.update
);
router.post('/delete', StarshipController.delete);
router.get('/network/:id', StarshipController.getNetworkId);
router.post('/search', StarshipController.searchByName);

module.exports = router;
