const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const userHealthDataController = require('../controllers/user_health_data');

router.post('/update', authenticate(), userHealthDataController.updateHealthData);

module.exports = router;
