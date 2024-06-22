'use strict'
const { UserHealthData, sequelize } = require('../models')
const {
  calculateBMR,
  calculateDailyCalorie,
  calculateTodayIntake,
  calculateCalorieToEat
} = require('../utils/calorieCalculations.js')
const moment = require('moment')
const { Op } = require('sequelize')

const updateUserHealthData = async (
  user_id,
  weight,
  height,
  age,
  gender,
  target,
  activity_level,
  foodCalorie = 0
) => {
  try {
    // Tính toán BMR
    const bmr = calculateBMR(gender, weight, height, age);

    // Tính toán daily calorie và calorie to eat
    const daily_calorie = calculateDailyCalorie(bmr, activity_level);
    const calorie_to_eat = calculateCalorieToEat(daily_calorie, target);
    const TODAY_START = moment().startOf('day'); // Bắt đầu ngày hôm nay
    const NOW = moment().endOf('day'); // Kết thúc ngày hôm nay

    let userHealthData = await UserHealthData.findOne({
      where: {
        user_id,
        createdAt: {
          [Op.between]: [TODAY_START, NOW],
        },
      },
    });

    // Nếu không tìm thấy, tạo mới dữ liệu cho ngày hiện tại
    if (!userHealthData) {
      userHealthData = await UserHealthData.create({
        user_id,
        daily_calorie,
        calorie_to_eat,
        today_intake: 0, // Khởi tạo today intake
        // Các thông tin khác như target, weightGainLoss có thể thêm vào từ form hoặc giá trị mặc định
      });
    } else {
      // Nếu đã tồn tại dữ liệu, cập nhật lại các giá trị
      userHealthData.daily_calorie = daily_calorie;
      userHealthData.calorie_to_eat = calorie_to_eat;
    }

    // Cập nhật today intake với tham số foodCalorie được truyền vào
    userHealthData.today_intake = calculateTodayIntake(
      userHealthData.today_intake,
      foodCalorie
    );

    // Lưu thay đổi vào database
    await userHealthData.save();

    return userHealthData;
  } catch (error) {
    console.log(error);
    throw new Error('Error updating user health data');
  }
};


module.exports = {
  updateUserHealthData
}
