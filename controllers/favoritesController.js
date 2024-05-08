const path = require('path');
const Movie = require('../models/Movie');
const Rating = require('../models/Rating');
const Review = require('../models/Review');
const { Op } = require('sequelize');
const Sequelize = require('sequelize')

exports.getFavorites = async (req, res) => {
    try {
        const userId = req.session.user.id;
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
            order: order,
            include: [
                {
                    model: Rating,
                    where: { userId: userId },
                    required: false // Позволяет получить фильмы, у которых нет рейтинга
                },
                {
                    model: Review,
                    where: { userId: userId },
                    required: false // Позволяет получить фильмы, у которых нет рецензии
                }
            ],
            where: {
                [Op.or]: [
                    Sequelize.literal('`Ratings`.`userId` IS NOT NULL'),
                    Sequelize.literal('`Reviews`.`userId` IS NOT NULL')
                ]
            }
        });
        // Serve the HTML file along with the movies data
        res.render(path.join(__dirname, '..', 'public', 'html', 'favorites.ejs'), { movies: movies });
    } catch (error) {
        console.error('Failed to fetch movies:', error);
        res.sendStatus(500);
    }
};