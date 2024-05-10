const path = require('path');
const Movie = require('../models/Movie');
const { Op } = require('sequelize');

exports.getSearch = async (req, res) => {
    try {
        const searchQuery = req.query.q; // Получаем поисковый запрос из параметра запроса

        // Выполняем поиск фильмов по названию, используя оператор LIKE для частичного совпадения
        const movies = await Movie.findAll({
            where: {
                title: {
                    [Op.like]: `%${searchQuery}%` // Ищем название, содержащее введенный запрос
                }
            },
            attributes: ['id', 'title', 'director', 'poster']
        });

        // Отправляем шаблон и данные результатов поиска
        res.render(path.join(__dirname, '..', 'public', 'html', 'search.ejs'), {
            movies: movies,
            session: req.session
        });
    } catch (error) {
        console.error('Failed to search movies:', error);
        res.sendStatus(500);
    }
};