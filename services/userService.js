// services/userService.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, UserHealthData } = require('../models');
const { ValidationError, UnauthorizedError, NotFoundError, ConflictError } = require('./errorService');

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

// Đăng ký
const registerUser = async (userData) => {
  const tableName = User.tableName; // Lấy tên bảng từ model User
  console.log(`Tên bảng đang sử dụng là: ${tableName}`);
  const existingUser = await User.findOne({ where: { email: userData.email } });
  if (existingUser) {
    throw new ConflictError('Email is already in use');
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  try {
    const user = await User.create({ ...userData, password_hash: hashedPassword });
    console.log(User)
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

const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const userProfile = await User.findByPk(userId, {
      include: {
        model: UserHealthData,
        attributes: ['height', 'age', 'gender', 'target', 'weight', 'activity_level']
      }
    });

    if (!userProfile) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(userProfile);
    next()
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Chỉnh sửa thông tin cá nhân
const updateUser = async (userId, updateData) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Hash the password if it is present in updateData
  if (updateData.password) {
    updateData.password_hash = await bcrypt.hash(updateData.password, 10);
    delete updateData.password; // Remove the plain text password from updateData
  }

  try {
    // Use set to update user data and save to persist changes
    await user.set(updateData);
    await user.save();
    return user;
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      throw new ValidationError(err.errors.map(e => e.message).join(', '));
    }
    throw new ValidationError('Update failed');
  }
};


module.exports = {
  registerUser,
  loginUser,
  updateUser,
  getAllUsers,
  getUserProfile,
};
