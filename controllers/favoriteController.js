const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/favorites.json');

// 모든 즐겨찾기 가져오기
const getAllFavorites = (req, res) => {
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ message: '데이터 로드 실패' });
    res.json(JSON.parse(data));
  });
};

// 즐겨찾기 추가하기
const addFavorite = (req, res) => {
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ message: '데이터 로드 실패' });

    const favorites = JSON.parse(data);
    const newFavorite = {
      id: Date.now(),  // 임시 ID
      ...req.body
    };

    favorites.push(newFavorite);

    fs.writeFile(filePath, JSON.stringify(favorites, null, 2), (err) => {
      if (err) return res.status(500).json({ message: '저장 실패' });
      res.status(201).json(newFavorite);
    });
  });
};

module.exports = { getAllFavorites, addFavorite };
