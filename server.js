const express = require('express');
const cors = require('cors');
const favoriteRoutes = require('./routes/favoriteRoutes');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// 즐겨찾기 라우트 연결
app.use('/api', favoriteRoutes);

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
