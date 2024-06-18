const { FavoriteFood, Food, FoodImage } = require('../models');

const addFoodToFavorites = async (user_id, food_id) => {
  try {
    // Check if the favorite food already exists
    const existingFavorite = await FavoriteFood.findOne({ where: { user_id, food_id } });

    if (existingFavorite) {
      return { message: 'Food is already in favorites' };
    }

    // If it doesn't exist, create a new favorite food entry
    const favorite = await FavoriteFood.create({ user_id, food_id });
    return favorite;
  } catch (error) {
    console.error('Error adding food to favorites:', error);
    throw new Error('Error adding food to favorites');
  }
};

const removeFoodFromFavorites = async (user_id, food_id) => {
  try {
    const result = await FavoriteFood.destroy({ where: { user_id, food_id } });
    return result;
  } catch (error) {
    console.error('Error removing food from favorites:', error);
    throw new Error('Error removing food from favorites');
  }
};

const getAllFavoriteFoods = async (user_id) => {
  try {
    const favoriteFoods = await FavoriteFood.findAll({
      where: { user_id },
      include: [
        {
          model: Food,
          as: 'food',
          attributes: ['id', 'name', 'description', 'calories_per_serving', 'protein', 'fat', 'type', 'carbohydrate'],
          include: {
            model: FoodImage,
            as:'images', // This should match the alias in the Food model, e.g. 'images
            attributes: ['image_url'],
          }
        }
      ]
    });
    return favoriteFoods;
  } catch (error) {
    console.error('Error retrieving favorite foods:', error);
    throw new Error('Error retrieving favorite foods');
  }
};

module.exports = {
  addFoodToFavorites,
  removeFoodFromFavorites,
  getAllFavoriteFoods
};
