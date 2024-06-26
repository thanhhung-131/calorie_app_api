const { Food, FoodImage } = require('../models')
const { uploadImageToFirebase } = require('../firebase')
const { Op, Sequelize } = require('sequelize')

exports.createFood = async (req, res) => {
  const {
    name,
    description,
    calories_per_serving,
    protein,
    fat,
    carbohydrate,
    type,
    image_url
  } = req.body
  const image = req.file

  try {
    // Kiểm tra độ dài tên món ăn
    if (name.length < 3 || name.length > 50) {
      return res
        .status(400)
        .json({ error: 'Name must be between 3 and 50 characters.' })
    }

    // Kiểm tra tên món ăn có tồn tại trong hệ thống không
    const existingFood = await Food.findOne({ where: { name } })
    if (existingFood) {
      return res
        .status(400)
        .json({ error: 'Name already exists. Please choose a different name.' })
    }

    // Tạo bản ghi món ăn mới
    const food = await Food.create({
      name,
      description,
      calories_per_serving,
      protein,
      fat,
      carbohydrate,
      type
    })

    let imageUrl = null

    // Nếu có ảnh, tải lên Firebase và tạo bản ghi ảnh món ăn
    if (image) {
      imageUrl = await uploadImageToFirebase(name, image.buffer)
      await FoodImage.create({
        food_id: food.id,
        image_url: imageUrl
      })
    } else {
      imageUrl = image_url
      await FoodImage.create({
        food_id: food.id,
        image_url: imageUrl
      })
    }

    // Bao gồm URL của ảnh trong phản hồi
    const foodResponse = {
      ...food.toJSON(),
      image_url: imageUrl
    }

    res.status(201).json(foodResponse)
  } catch (error) {
    console.error('Error creating food:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

exports.updateFood = async (req, res) => {
  const { foodId } = req.params;
  const {
    name,
    description,
    calories_per_serving,
    protein,
    fat,
    carbohydrate,
    type
  } = req.body;
  const image = req.file;

  try {
    let food = await Food.findByPk(foodId);

    if (!food) {
      return res.status(404).json({ error: 'Food not found' });
    }

    // Update food data
    food.name = name || food.name;
    food.description = description || food.description;
    food.calories_per_serving = calories_per_serving || food.calories_per_serving;
    food.protein = protein || food.protein;
    food.fat = fat || food.fat;
    food.carbohydrate = carbohydrate || food.carbohydrate;
    food.type = type || food.type;

    await food.save();

    let imageUrl = null;
    // If an image is provided, upload it to Firebase and update food image URL
    if (image) {
      imageUrl = await uploadImageToFirebase(foodId, image.buffer);
      let foodImage = await FoodImage.findOne({ where: { food_id: foodId } });

      if (!foodImage) {
        foodImage = await FoodImage.create({
          food_id: foodId,
          image_url: imageUrl
        });
      } else {
        foodImage.image_url = imageUrl;
        await foodImage.save();
      }
    } else {
      // Retrieve existing image URL if no new image is provided
      const foodImage = await FoodImage.findOne({ where: { food_id: foodId } });
      if (foodImage) {
        imageUrl = foodImage.image_url;
      }
    }

    res.json({
      ...food.toJSON(),
      image_url: imageUrl
    });
  } catch (error) {
    console.error('Error updating food:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.getAllFoodsWithImages = async (req, res) => {
  try {
    const foods = await Food.findAll({
      include: [{ model: FoodImage, as: 'images' }]
    })
    res.json(foods)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

exports.searchFoodsByName = async (req, res) => {
  var { name } = req.query
  name = name.toLowerCase()

  try {
    const foods = await Food.findAll({
      where: {
        name: {
          [Op.like]: `%${name}%` // Use Op.iLike for case-insensitive search
        }
      },
      include: { model: FoodImage, as: 'images' }
    })

    res.json(foods)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

exports.searchFoodByName = async (req, res) => {
  var { name } = req.query
  name = name.toLowerCase()

  try {
    const food = await Food.findOne({
      where: {
        name: {
          [Op.like]: `%${name}%`
        }
      }
    })

    if (!food) {
      return res.status(404).json({ error: 'Food not found' })
    }

    res.json(food)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

exports.getFoodById = async (req, res) => {
  const { id } = req.query

  try {
    const food = await Food.findOne({
      where: { id },
      include: { model: FoodImage, as: 'images' }
    })

    if (!food) {
      return res.status(404).json({ error: 'Food not found' })
    }

    res.json(food)
  } catch (error) {
    console.error('Error fetching food by ID:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

exports.getHighCalorieFoods = async (req, res) => {
  const { threshold } = req.params

  try {
    const foods = await Food.findAll({
      where: {
        calories_per_serving: {
          [Sequelize.Op.gt]: threshold
        }
      },
      include: { model: FoodImage, as: 'images' }
    })

    res.json(foods)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

exports.getLowCalorieFoods = async (req, res) => {
  const { threshold } = req.params

  try {
    const foods = await Food.findAll({
      where: {
        calories_per_serving: {
          [Sequelize.Op.lt]: threshold
        }
      },
      include: { model: FoodImage, as: 'images' }
    })

    res.json(foods)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

exports.deleteFood = (req, res) => {
  const { foodId } = req.params

  Food.destroy({ where: { id: foodId } })
    .then(() => {
      res.json({ message: 'Food deleted successfully' })
    })
    .catch((error) => {
      console.error('Error deleting food:', error)
      res.status(500).json({ error: 'Internal server error' })
    })
}
