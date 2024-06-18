const express = require('express');
const router = express.Router();
const { addFavoriteFood, removeFavoriteFood, getFavoriteFoods } = require('../controllers/favorite');
const authenticate = require('../middlewares/authenticate');

// Add food to favorites
router.post('/', authenticate(), addFavoriteFood);

// Remove food from favorites
router.delete('/', authenticate(), removeFavoriteFood);

// Get all favorite foods
router.get('/', authenticate(), getFavoriteFoods);

module.exports = router;
