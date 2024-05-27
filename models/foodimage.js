'use strict';
module.exports = (sequelize, DataTypes) => {
  const FoodImage = sequelize.define('FoodImage', {
    food_id: DataTypes.INTEGER,
    image_url: DataTypes.STRING,
  }, {});
  FoodImage.associate = function(models) {
    // associations can be defined here
    FoodImage.belongsTo(models.Food, { foreignKey: 'food_id' });
  };
  return FoodImage;
};
