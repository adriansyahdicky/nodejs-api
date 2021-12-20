const express = require('express');
const router = express.Router();

const CategoriesController = require('../controllers/CategoriesController');

router.get('/list', CategoriesController.list);
router.post('/create', CategoriesController.create);
router.get('/get/:id', CategoriesController.get);
router.post('/update/:id', CategoriesController.update);
router.post('/delete', CategoriesController.delete);

module.exports = router;
