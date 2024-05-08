const path = require('path');
const Movie = require('../models/Movie');

exports.getHome = async (req, res) => {
    try {
        let sortOption = req.query.sort || 'highest-rated'; // Default sorting option

        let order;
        switch (sortOption) {
            case 'highest-rated':
                order = [['rating', 'DESC']];
                break;
            case 'lowest-rated':
                order = [['rating', 'ASC']];
                break;
            case 'alphabetical':
                order = [['title', 'ASC']];
                break;
            case 'release-year':
                order = [['year', 'DESC']];
                break;
            default:
                order = [['rating', 'DESC']]; // Default sorting option
                break;
        }

        // Query to fetch movies ordered by the selected sorting option
        const movies = await Movie.findAll({
            order: order
        });

        // Serve the HTML file along with the movies data
        res.render(path.join(__dirname, '..', 'public', 'html', 'home.ejs'), { movies: movies });
    } catch (error) {
        console.error('Failed to fetch movies:', error);
        res.sendStatus(500);
    }
};

