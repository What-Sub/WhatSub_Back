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
const newsRoutes = require('./routes/news-routes.js');  // src 폴더 경로로 수정



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
// 뉴스 라우터 사용
app.use(newsRoutes);


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