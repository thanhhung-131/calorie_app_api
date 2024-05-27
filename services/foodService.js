const { Food, FoodImage } = require('../models');

exports.createFood = async (req, res) => {
  const { name, description, calories_per_serving } = req.body;
  const food = await Food.create({ name, description, calories_per_serving });
  res.json(food);
};

exports.addFoodImage = async (req, res) => {
  const { foodId } = req.params;
  const { image_url } = req.body;
  const foodImage = await FoodImage.create({ food_id: foodId, image_url });
  res.json(foodImage);
};
