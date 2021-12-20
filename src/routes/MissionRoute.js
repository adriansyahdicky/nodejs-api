const express = require('express');
const router = express.Router();

const MissionController = require('../controllers/MissionController');

router.get('/list', MissionController.list);
router.post('/create', MissionController.create);
router.get('/get/starship/:id', MissionController.getStarshipById);
router.post('/delete/starship', MissionController.deleteByStarshipId);
router.post('/delete', MissionController.delete);
router.post('/category', MissionController.getByCategoryId);
router.post('/update/:id', MissionController.update);
router.get('/get/:id', MissionController.getById);
router.post('/search', MissionController.searchByName);
router.get(
  '/get/starship/counter/:id',
  MissionController.getStarshipByIdCounter
);

module.exports = router;
