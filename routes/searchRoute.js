const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// Обработчик запроса поиска
router.get('/', searchController.getSearch);

module.exports = router;