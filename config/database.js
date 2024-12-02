const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config(); // .env 파일 로드

// MySQL 연결 설정
const pool = mysql.createPool({
  host: process.env.DB_HOST,          // MySQL 서버 주소
  user: process.env.DB_USER,          // MySQL 사용자 이름
  port: process.env.DB_PORT || 3306,  // MySQL 포트 (기본값은 3306)
  database: process.env.DB_NAME,      // 데이터베이스 이름
  password: process.env.DB_PASSWORD,  // MySQL 비밀번호
  waitForConnections: true,
  connectionLimit: 10,                // 커넥션 풀 크기
  queueLimit: 0,                      // 대기 요청 한도
});

// 연결 확인
pool.getConnection()
  .then(conn => {
    console.log('Connected to the database');
    conn.release();  // 연결 반환
  })
  .catch(err => {
    console.error('Database connection failed:', err.stack);
  });

module.exports = pool;
