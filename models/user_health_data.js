'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserHealthData extends Model {
    static associate(models) {
      UserHealthData.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  };
  UserHealthData.init({
    user_id: DataTypes.INTEGER,
    daily_calorie: DataTypes.FLOAT,
    today_intake: DataTypes.FLOAT,
    calorie_to_eat: DataTypes.FLOAT,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'UserHealthData',
    tableName: 'user_health_data',
  });
  return UserHealthData;
};
