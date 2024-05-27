const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');
const cors = require('cors');
const routes = require('./routes');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();
app.use(bodyParser.json());

// Cấu hình CORS middleware để chấp nhận tất cả các yêu cầu
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// Sử dụng các routes
app.use('/', (req, res) => {
  res.send('Hello World');
});
app.use('/api', routes);

// Middleware xử lý lỗi
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
const PROTOCOL = process.env.PROTOCOL || 'http';
const PUBLIC_IP = '54.196.177.120'; // Địa chỉ IP của bạn

app.listen(PORT, async () => {
  const fullUrl = `${PROTOCOL}://${PUBLIC_IP}:${PORT}`;
  console.log(`Server is running on ${fullUrl}`);
  await sequelize.sync();
  console.log('Database synchronized');
});
