// Hàm tính BMR (Basal Metabolic Rate)
const calculateBMR = (gender, weight, height, age) => {
  let bmr = 0
  if (gender === 'male') {
    bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
  } else if (gender === 'female') {
    bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age
  }
  return bmr
}

// Hàm tính daily calorie dựa trên BMR và mức độ hoạt động
const calculateDailyCalorie = (bmr, activity_level) => {
  let calorie = 0
  switch (activity_level) {
    case 'sedentary':
      calorie = bmr * 1.2
      break
    case 'lightly_active':
      calorie = bmr * 1.375
      break
    case 'moderately_active':
      calorie = bmr * 1.55
      break
    case 'very_active':
      calorie = bmr * 1.725
      break
    case 'extra_active':
      calorie = bmr * 1.9
      break
    default:
      calorie = bmr * 1.2 // Giả sử mặc định là sedentary nếu không có activity level
  }
  return calorie
}

// Hàm tính calorie to eat
const calculateCalorieToEat = (dailyCalorie, target) => {
  let calorieToEat = 0

  switch (target) {
    case 'weight_gain':
      calorieToEat = dailyCalorie + 500 // Tăng 500 calo so với daily calorie
      break
    case 'weight_loss':
      calorieToEat = dailyCalorie - 500 // Giảm 500 calo so với daily calorie
      break
    default:
      calorieToEat = dailyCalorie // Mặc định không thay đổi nếu không có target
  }

  // Kiểm tra nếu calorie to eat âm (trường hợp edge)
  if (calorieToEat < 0) {
    calorieToEat = 0 // Đảm bảo không có giá trị âm
  }

  return calorieToEat
}

// Hàm tính today intake khi thêm 1 món ăn vào daily diet
const calculateTodayIntake = (currentIntake, foodCalorie) => {
  return currentIntake + foodCalorie;
}

module.exports = {
  calculateBMR,
  calculateDailyCalorie,
  calculateCalorieToEat,
  calculateTodayIntake,
}
