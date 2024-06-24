// models/user.js
'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      username: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      avatar_url: {
        type: DataTypes.STRING(255)
      },
      role: {
        type: DataTypes.ENUM('user', 'admin'),
        allowNull: false,
        defaultValue: 'user',
      },
      gender: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      weight: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      height: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      activity_level: {
        type: DataTypes.ENUM('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active'),
        allowNull: true,
        defaultValue: 'sedentary',
      },
      target: {
        type: DataTypes.ENUM('weight_gain', 'weight_loss', 'maintain'),
        allowNull: true,
        defaultValue: 'maintain',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    },
    {
      tableName: 'users',
      timestamps: true
    }
  );

  User.associate = function(models) {
    // associations can be defined here
  };

  return User;
};
