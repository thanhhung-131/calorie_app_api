'use strict';
module.exports = (sequelize, DataTypes) => {
  const CalorieCalculationHistory = sequelize.define('CalorieCalculationHistory', {
    food_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    calories_estimated: DataTypes.FLOAT,
  }, {});
  CalorieCalculationHistory.associate = function(models) {
    // associations can be defined here
    CalorieCalculationHistory.belongsTo(models.Food, { foreignKey: 'food_id' });
    CalorieCalculationHistory.belongsTo(models.User, { foreignKey: 'user_id' });
  };
  return CalorieCalculationHistory;
};
