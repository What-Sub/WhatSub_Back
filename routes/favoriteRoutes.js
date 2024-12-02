const express = require('express');
const router = express.Router();
const { getAllFavorites, addFavorite } = require('../controllers/favoriteController');

router.get('/favorites', getAllFavorites);
router.post('/favorites', addFavorite);

module.exports = router;
