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

// Phương thức để lấy thông tin người dùng bằng ID
const getUserById = async (userId) => {
  try {
    const user = await User.findByPk(userId); // Truy vấn người dùng từ cơ sở dữ liệu bằng ID
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  } catch (error) {
    throw new Error('Error fetching user');
  }
};

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

  const token = jwt.sign({ userId: user.id }, 'secret_key');
  return token;
};

const getUserProfile = async (req, res, next) => {
  const userId = req.user.id;
  console.log(userId)
  try {
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
    console.log(error)
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

// Delete a user from the database
const deleteUser = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  await user.destroy();
};

// Update role of a user
const updateUserRole = async (userId, role) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  try {
    await user.update({ role });
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
  getUserById,
  deleteUser,
  updateUserRole,
};
