// services/userService.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { ValidationError, UnauthorizedError, NotFoundError, ConflictError } = require('./errorService');

// Đăng ký
const registerUser = async (userData) => {
  const existingUser = await User.findOne({ where: { email: userData.email } });
  if (existingUser) {
    throw new ConflictError('Email is already in use');
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  try {
    const user = await User.create({ ...userData, password_hash: hashedPassword });
    return user;
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      throw new ValidationError(err.errors.map(e => e.message).join(', '));
    }
    throw new ValidationError('Registration failed');
  }
};

// Đăng nhập
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const token = jwt.sign({ userId: user.id }, 'secret_key'); // Replace 'secret_key' with your secret key
  return token;
};

// Phương thức để lấy danh sách người dùng
const getAllUsers = async () => {
  try {
    const users = await User.findAll(); // Truy vấn danh sách người dùng từ cơ sở dữ liệu
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Error fetching users');
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
};
