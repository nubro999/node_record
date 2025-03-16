const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 라우트 설정
const userRoutes = require('./routes/user.routes');
const diaryRoutes = require('./routes/diary.routes');

app.use('/api/users', userRoutes);
app.use('/api/diaries', diaryRoutes);

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Diary Application API' });
});

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
