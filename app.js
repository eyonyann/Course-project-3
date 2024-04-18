const express = require('express');
const session = require('express-session');
const multer = require('multer');
const bcrypt = require('bcrypt');
const sequelize = require('./utils/database');

// Ensure these names match the exported models and correct file names.
const User = require('./models/User');
const Admin = require('./models/Admin');
const Client = require('./models/Client');
const Movie = require('./models/Movie');
const Review = require('./models/Review');
const Rating = require('./models/Rating');

const app = express();
const PORT = process.env.PORT || 3000;
const upload = multer();

const userCredentials = {
    username: 'user123',
    password: 'pass123'
};

async function start() {
    try {
        await sequelize.sync();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (e) {
        console.error('Failed to start the server:', e);
    }
}

// Session configuration
app.use(session({
    secret: 'your_secret_key', // Replace 'your_secret_key' with a real secret string
    resave: false,
    saveUninitialized: true,
    cookie: { secure: 'auto', httpOnly: true }, // Set 'secure' to true if you're using HTTPS
}));

// Body parser for form data
app.use(express.urlencoded({ extended: true }));

// Serve static files from "public" directory
app.use(express.static('public'));

app.set('view engine', 'ejs');

function requireLogin(req, res, next) {
    if (!req.session.user) {
        res.redirect('/signIn');
    } else {
        next();
    }
}

app.get('/', requireLogin, (req, res) => {
    res.sendFile(__dirname + '/public/html/home.html');
});

app.get('/home', requireLogin, (req, res) => {
    res.sendFile(__dirname + '/public/html/home.html');
});

app.get('/favorites', requireLogin, (req, res) => {
    res.sendFile(__dirname + '/public/html/favorites.html');
});

app.get('/search', requireLogin, (req, res) => {
    res.sendFile(__dirname + '/public/html/search.html');
});

app.get('/profile', requireLogin, async (req, res) => {
    res.sendFile(__dirname + '/public/html/profile.html');
});



app.get('/signIn', (req, res) => {
    res.sendFile(__dirname + '/public/html/signIn.html');
});

app.post('/signIn', upload.none(), async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username: username } });

        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (isPasswordValid) {
                req.session.user = user.username;
                req.session.userId = user.id;
                res.status(200).json({ message: 'Successfully logged in!' });
            } else {
                res.status(401).json({ error: 'Incorrect username or password!' });
            }
        } else {
            res.status(401).json({ error: 'User not found!' });
        }
    } catch (error) {
        console.error('Error signing in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/signUp', (req, res) => {
    res.sendFile(__dirname + '/public/html/signUp.html');
});

app.post('/signUp', upload.none(), async (req, res) => {
    const { name, username, password } = req.body;
    const nameRegex = /^[А-ЯЁ][а-яё]+\s[А-ЯЁ][а-яё]+$/;
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{10,}$/;

    try {
        // Проверяем, существует ли пользователь с таким же именем пользователя (username)
        const existingUser = await User.findOne({ where: { username: username } });

        if (existingUser) {
            // Если пользователь существует, возвращаем ошибку
            res.status(401).json({ error: 'Username должен быть уникальным.' });
        } else if (!nameRegex.test(name)) {
            // Если ФИО не соответствует регулярному выражению, возвращаем ошибку
            res.status(401).json({ error: 'ФИО на русском должно быть, каждое слово с большой буквы.' });
        } else if (!usernameRegex.test(username)) {
            // Если имя пользователя не соответствует регулярному выражению, возвращаем ошибку
            res.status(401).json({ error: 'Username должен состоять только из английских символов и цифр.' });
        } else if (!passwordRegex.test(password)) {
            // Если пароль не соответствует регулярному выражению, возвращаем ошибку
            res.status(401).json({ error: 'Пароль должен содержать минимум 10 символов.' });
        } else {
            // Если все проверки прошли успешно, хэшируем пароль
            const hashedPassword = await bcrypt.hash(password, 10);

            // Создаем нового пользователя в базе данных
            const newUser = await User.create({
                username: username,
                password: hashedPassword
            });

            // Устанавливаем сессию пользователя
            req.session.user = newUser.id; // Можно сохранить ID пользователя в сессии
            res.status(200).json({ message: 'Пользователь зарегистрирован!' });
        }
    } catch (error) {
        // Если произошла ошибка при сохранении пользователя в базу данных, возвращаем ошибку сервера
        console.error('Error signing up:', error);
        res.status(500).json({ error: 'Не удалось зарегистрировать пользователя.' });
    }
});

app.get('/home', requireLogin, (req, res) => {
    res.sendFile(__dirname + '/public/html/home.html');
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Cannot log out');
        }
        res.redirect('/signIn');
    });
});

start();
