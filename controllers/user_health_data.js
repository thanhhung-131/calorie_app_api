const { updateUserHealthData } = require('../services/user_health_dataService');
const { User } = require('../models');

const updateHealthData = async (req, res, next) => {
  const user_id = req.user.id;
  const foodCalorie = req.body.calorie || 0;

  try {
    // Lấy thông tin người dùng từ database
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Gọi hàm updateUserHealthData với thông tin từ đối tượng User
    const updatedHealthData = await updateUserHealthData(user.id, user.weight, user.height, user.age, user.gender, user.target, user.activity_level, foodCalorie);

    return res.status(200).json(updatedHealthData);
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  updateHealthData,
};
