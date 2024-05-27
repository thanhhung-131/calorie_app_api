const express = require('express');
const router = express.Router();
const { userService } = require('../services');

router.get('/', async (req, res) => {
  try {
    const users = await userService.getAllUsers(); // Gọi phương thức từ service để lấy danh sách người dùng
    res.json(users); // Trả về danh sách người dùng dưới dạng JSON
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Đăng ký người dùng mới
router.post('/register', async (req, res) => {
  try {
    const user = await userService.registerUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Đăng nhập
router.post('/login', async (req, res) => {
  try {
    const token = await userService.loginUser(req.body);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
