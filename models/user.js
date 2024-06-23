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
      },
      gender: DataTypes.STRING,
      weight: DataTypes.FLOAT,
      height: DataTypes.FLOAT,
      age: DataTypes.INTEGER,
      activity_level: {
        type: DataTypes.ENUM(
          'sedentary',
          'lightly_active',
          'moderately_active',
          'very_active',
          'extra_active'
        ),
        allowNull: false,
        defaultValue: 'sedentary' // Giá trị mặc định
      },
      target: {
        type: DataTypes.ENUM('weight_gain', 'weight_loss', 'maintain'),
        allowNull: false,
        defaultValue: 'maintain'
      }
    },
    {
      tableName: 'users', // Sử dụng đúng tên bảng là `users`
      underscored: true, // Tùy chọn để sử dụng kiểu đặt tên underscore trong các trường hợp
    }
  )

  User.associate = function (models) {
    // Định nghĩa các mối quan hệ tại đây nếu có
  }

  return User
}
