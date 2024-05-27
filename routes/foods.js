const express = require('express');
const router = express.Router();
const foodService = require('../services/foodService');

router.post('/', foodService.createFood);
router.post('/:foodId/images', foodService.addFoodImage);

module.exports = router;
