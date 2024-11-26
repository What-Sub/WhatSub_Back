// 1. 표준 라이브러리
const express = require('express');

// 2. 외부 라이브러리
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');

// 3. 내부 모듈
dotenv.config();
const db = require('../config/database.js');

// 라우터 선언 
const graphRoutes = require('./routes/graph-route');
const shortestPathRoute = require('./routes/shortest-path-route');
const leastTransfersRoutes = require('./routes/least-transfers-route');

// Express 앱 설정
const app = express();
app.set('port', process.env.PORT || 8000);

if (process.env.NODE_ENV === 'production') {
  app.enable('trust proxy');
  app.use(morgan('combined'));
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: false,
    })
  );
} else {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//라우터
app.get('/', async (req, res) => {
  res.send('라우터 작동함')
})

app.use('/graph', graphRoutes);
app.use('/shortest-path', shortestPathRoute);
app.use('/least-transfers-path', leastTransfersRoutes);

// 404 에러 처리 미들웨어
app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
  });

// 서버 시작
const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});