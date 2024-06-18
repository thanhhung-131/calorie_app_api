const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const authenticate = require('../middlewares/authenticate');

// Lấy danh sách người dùng
router.get('/', authenticate('admin'), userController.getAllUsers);

// Đăng ký người dùng mới
router.post('/register', userController.registerUser);

// Đăng nhập
router.post('/login', userController.loginUser);

// Xem thông tin cá nhân
router.get('/profile', authenticate(), userController.getUserProfile);

// Chỉnh sửa thông tin cá nhân
router.put('/update', authenticate(), userController.updateUser);

// Xóa người dùng
router.delete('/:userId', authenticate('admin'), userController.deleteUser);

module.exports = router;
