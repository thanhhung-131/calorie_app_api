const express = require('express');
const router = express.Router();

const userRoutes = require('./users');
const foodRoutes = require('./foods');
const calorieRoutes = require('./calories');

router.use('/users', userRoutes);
router.use('/foods', foodRoutes);
router.use('/calories', calorieRoutes);

module.exports = router;
