// src/controllers/newsController.js
const db = require('../../config/database');  // 경로는 수정된 그대로

exports.getNews = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM News');
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching news data');
    }
};