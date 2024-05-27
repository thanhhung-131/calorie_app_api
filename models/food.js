'use strict';
module.exports = (sequelize, DataTypes) => {
  const Food = sequelize.define('Food', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    calories_per_serving: DataTypes.FLOAT,
  }, {});
  Food.associate = function(models) {
    // associations can be defined here
    Food.hasMany(models.FoodImage, { foreignKey: 'food_id' });
    Food.hasMany(models.CalorieCalculationHistory, { foreignKey: 'food_id' });
  };
  return Food;
};
