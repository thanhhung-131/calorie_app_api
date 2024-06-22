// upload.js
const multer = require('multer');
const storage = multer.memoryStorage(); // Lưu trữ file trong bộ nhớ tạm thời
const upload = multer({ storage: storage });

module.exports = upload;
