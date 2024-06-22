const express = require('express');
const router = express.Router();
const foodController = require('../controllers/food');
const authenticate = require('../middlewares/authenticate');
const multer = require('multer');
const upload = multer();

// Thêm mới món ăn
router.post('/', authenticate('admin'), upload.single('image_url'), foodController.createFood);

// Thêm ảnh cho món ăn và cập nhật thông tin món ăn
router.post('/food/:foodId', authenticate('admin'), upload.single('image_url'), foodController.updateFood);

// Lấy toàn bộ món ăn cùng ảnh
router.get('/', foodController.getAllFoodsWithImages);
router.get('/food', foodController.getFoodById);

// Tìm kiếm món ăn theo tên
router.get('/search', foodController.searchFoodsByName);
router.get('/search-one', foodController.searchFoodByName);

router.get('/high-calorie/:threshold', foodController.getHighCalorieFoods);

module.exports = router;
