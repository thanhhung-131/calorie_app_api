const express = require('express');
const router = express.Router();
const calorieService = require('../services/calorieService');

router.post('/', calorieService.calculateCalories);

module.exports = router;
