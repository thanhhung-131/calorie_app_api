// models/food.js
'use strict'
module.exports = (sequelize, DataTypes) => {
  const Food = sequelize.define(
    'Food',
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      calories_per_serving: DataTypes.FLOAT,
      protein: DataTypes.FLOAT,
      fat: DataTypes.FLOAT,
      carbohydrate: DataTypes.FLOAT,
      type: DataTypes.ENUM('Non-Vegetarian', 'Vegetarian', 'Mixed')
    },
    {
      tableName: 'food'
    }
  )

  Food.associate = function (models) {
    // associations can be defined here
    Food.hasMany(models.FavoriteFood, {
      as: 'favoriteFoods',
      foreignKey: 'food_id'
    })
    Food.hasMany(models.FoodImage, { as: 'images', foreignKey: 'food_id' })
  }

  return Food
}
