const { uploadImageToFirebase } = require('../firebase');
const { userService } = require('../services');
const { getUserProfile } = require('../services/userService');

// Lấy danh sách người dùng
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Lấy thông tin người dùng bằng ID
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await userService.getUserById(userId);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Đăng ký người dùng mới
exports.registerUser = async (req, res) => {
  try {
    const user = await userService.registerUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Đăng nhập
exports.loginUser = async (req, res) => {
  try {
    const token = await userService.loginUser(req.body);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Chỉnh sửa thông tin cá nhân
exports.updateUser = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is stored in the request by the authenticate middleware

    // Xử lý file upload
    if (req.file) {
      const file = req.file;
      const imageUrl = await uploadImageToFirebase(file.originalname, file.buffer);

      // Cập nhật thông tin người dùng với link ảnh
      const user = await userService.updateUser(userId, { ...req.body, avatar_url: imageUrl });
      res.json(user);
    } else {
      // Nếu không có file upload, chỉ cập nhật thông tin người dùng
      const user = await userService.updateUser(userId, req.body);
      res.json(user);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Xem thông tin cá nhân
exports.getUserProfile = async (req, res) => {
  try {
    const user = req.user; // user is already added to req by authenticate middleware

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar_url,
      height: user.height,
      weight: user.weight,
      age: user.age,
      gender: user.gender,
      target: user.target,
      activity_level: user.activity_level,
    });
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Xóa người dùng
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    await userService.deleteUser(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Cập nhật role người dùng
exports.updateUserRole = async (req, res) => {
  try {
    const userId = req.params.userId;
    const role = req.body.role;
    const user = await userService.updateUserRole(userId, role);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
