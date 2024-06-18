'use strict';
module.exports = (sequelize, DataTypes) => {
  const FavoriteFood = sequelize.define('FavoriteFood', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Adjust the model name if necessary
        key: 'id'
      }
    },
    food_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Foods', // Adjust the model name if necessary
        key: 'id'
      }
    }
  }, {
    tableName: 'favorite_foods', // Ensure the table name matches
  });

  FavoriteFood.associate = function(models) {
    FavoriteFood.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    FavoriteFood.belongsTo(models.Food, { foreignKey: 'food_id', as: 'food' });
  };

  return FavoriteFood;
};
