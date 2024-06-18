const { addFoodToFavorites, removeFoodFromFavorites, getAllFavoriteFoods } = require('../services/favoriteService');

const addFavoriteFood = async (req, res) => {
  const user_id = req.user.id; // Assuming user id is stored in req.user
  const { food_id } = req.body;

  try {
    const result = await addFoodToFavorites(user_id, food_id);

    if (result.message) {
      res.status(200).json(result); // Food already in favorites
    } else {
      res.status(200).json({ message: 'Food added to favorites', data: result });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFavoriteFood = async (req, res) => {
  const user_id = req.user.id; // Assuming user id is stored in req.user
  const { food_id } = req.body;

  try {
    const result = await removeFoodFromFavorites(user_id, food_id);

    if (result) {
      res.status(200).json({ message: 'Food removed from favorites' });
    } else {
      res.status(404).json({ message: 'Favorite food not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFavoriteFoods = async (req, res) => {
  const user_id = req.user.id; // Assuming user id is stored in req.user

  try {
    const favoriteFoods = await getAllFavoriteFoods(user_id);
    res.status(200).json(favoriteFoods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addFavoriteFood,
  removeFavoriteFood,
  getFavoriteFoods
};
