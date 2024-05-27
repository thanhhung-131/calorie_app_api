const { CalorieCalculationHistory } = require('../models');

exports.calculateCalories = async (req, res) => {
  const { food_id, user_id, calories_estimated } = req.body;
  const history = await CalorieCalculationHistory.create({ food_id, user_id, calories_estimated });
  res.json(history);
};
