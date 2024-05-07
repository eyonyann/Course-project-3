const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

router.get('/:id', movieController.getMovieDetails); // Setup a route to fetch movie details

module.exports = router;
