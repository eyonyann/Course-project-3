const path = require('path');
const User = require('../models/User');
const Movie = require('../models/Movie'); // Убедитесь, что модель Movie правильно импортирована
const multer = require('multer');
const fs = require('fs');
const https = require('https');

// Настройка Multer для сохранения файлов
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = path.join(__dirname, '..', 'public', 'res', 'posters');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        // Сохранение с временным именем файла
        const tempName = 'temp' + Date.now() + path.extname(file.originalname);
        cb(null, tempName);
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 100000000 }  // Limit file size to 100MB
});
console.log(upload)


exports.getPanel = async (req, res) => {
    try {
        const users = await User.findAll();
        const movies = await Movie.findAll();
        const moviesData = movies.map(movie => ({
            title: movie.title,
            dateAdded: movie.dateAdded,
        }));
        res.render(path.join(__dirname, '..', 'public', 'html', 'panel.ejs'), {
            session: req.session,
            movies: movies,
            users: users
        });
    } catch (error) {
        console.error('Failed to search movies:', error);
        res.sendStatus(500);
    }
};

exports.postPanel = async (req, res) => {
    try {
        const { title, director, country, year, description } = req.body;

        // Find the last movie to get the next poster id
        const lastMovie = await Movie.findOne({
            order: [['id', 'DESC']]
        });

        // Create a new movie record in the database
        const movie = await Movie.create({
            title,
            director,
            country,
            year: parseInt(year),
            description,
            rating: 0,
            countOfRatings: 0,
            poster: `${lastMovie.id + 1}.jpg` // Poster will be updated later
        });

        console.log(req.body.poster)
        // Save the poster image to the filesystem
        saveBase64Image(req.body.poster, path.join(__dirname, '..', 'public', 'res', 'posters'), `${lastMovie.id + 1}.jpg`);

        res.send({ message: 'Movie added successfully', movieId: movie.id });
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

