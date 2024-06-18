const { Food, FoodImage } = require('../models');
const { uploadImageToFirebase } = require('../firebase');

const createFood = async (foodData, imageBuffer) => {
  try {
    // Tải ảnh lên Firebase Storage
    const imageUrl = await uploadImageToFirebase(foodData.name, imageBuffer);

    // Tạo một bản ghi thức ăn mới
    const food = await Food.create({
      ...foodData,
      imageUrl
    });

    return food;
  } catch (error) {
    console.error('Error creating food:', error);
    throw new Error('Internal server error');
  }
};

const addFoodImage = async (foodId, imageBuffer) => {
  try {
    // Tải ảnh lên Firebase Storage
    const imageUrl = await uploadImageToFirebase(foodId, imageBuffer);

    // Tạo một bản ghi ảnh mới
    const foodImage = await FoodImage.create({
      food_id: foodId,
      image_url: imageUrl
    });

    return foodImage;
  } catch (error) {
    console.error('Error adding food image:', error);
    throw new Error('Internal server error');
  }
};

const getAllFoodsWithImages = async () => {
  try {
    const foods = await Food.findAll({
      include: [{ model: FoodImage, as: 'images' }]
    });
    return foods;
  } catch (error) {
    console.error('Error fetching foods:', error);
    throw new Error('Internal server error');
  }
};

module.exports = {
  createFood,
  addFoodImage,
  getAllFoodsWithImages
};
