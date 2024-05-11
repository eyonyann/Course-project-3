const path = require('path');
const Movie = require('../models/Movie');
const Rating = require('../models/Rating');
const Review = require('../models/Review');
const User = require('../models/User');
const fs = require('fs');



exports.getMovieEditDetails = async (req, res) => {
    try {
        const movieId = req.params.id;
        const movie = await Movie.findByPk(movieId);

        if (!movie) {
            res.status(404).send('Movie not found');
            return;
        }


        res.render(path.join(__dirname, '..', 'public', 'html', 'edit.ejs'), {
            movie: movie,
            session: req.session
        });
    } catch (error) {
        console.error('Error fetching movie details:', error);
        res.status(500).send('Internal Server Error');
    }
};


exports.postMovieEditDetails = async (req, res) => {
    try {
        const { title, director, country, year, description } = req.body;

        const movieId = req.params.id;
        const oldMovie = await Movie.findByPk(movieId);

        await oldMovie.update({
            title,
            director,
            country,
            year: parseInt(year),
            description
        });


        console.log(req.body.poster)
        if (req.body.poster !== "undefined") {
            saveBase64Image(req.body.poster, path.join(__dirname, '..', 'public', 'res', 'posters'), `${oldMovie.id}.jpg`);
        }

        res.send({ message: 'Movie added successfully', movieId: oldMovie.id });
    } catch (error) {
        console.error('Error while adding movie:', error);
        res.status(500).send('Internal Server Error');
    }
};


function saveBase64Image(base64String, folderPath, imageName) {
    // Убедимся, что base64 строка начинается с правильного заголовка
    const matches = base64String.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);

    if (!matches || matches.length !== 3) {
        throw new Error('Invalid base64 string format');
    }

    const extension = matches[1];
    const imageData = matches[2];
    console.log(imageData);
    // Создаем буфер из base64 данных
    const buffer = Buffer.from(imageData, 'base64');

    // Проверяем, что путь существует
    if (!fs.existsSync(folderPath)) {
        throw new Error('Folder path does not exist');
    }

    // Генерируем путь к файлу
    const filePath = path.join(folderPath, `${imageName}`);

    // Записываем данные в файл
    fs.writeFileSync(filePath, buffer);

    console.log(`Image saved at: ${filePath}`);
}
