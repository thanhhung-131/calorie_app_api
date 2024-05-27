'use strict'

const { ENUM } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Please enter Your name'
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: 'Please enter a valid email address'
          }
        }
      },
      password_hash: DataTypes.STRING,
      avatar_url: DataTypes.STRING,
      role: {
        type: DataTypes.ENUM('admin', 'user', 'guest'), // Định nghĩa ENUM cho trường role
        allowNull: false,
        defaultValue: 'user'
      }
    },
    {}
  )
  User.associate = function (models) {
    // associations can be defined here
    User.hasMany(models.CalorieCalculationHistory, { foreignKey: 'user_id' })
  }
  return User
}
