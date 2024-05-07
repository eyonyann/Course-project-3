// Import required modules
const express = require('express');
const session = require('express-session');
const multer = require('multer');
const bcrypt = require('bcrypt');
const sequelize = require('./utils/database');

// Import models
const User = require('./models/User');
const Admin = require('./models/Admin');
const Client = require('./models/Client');
const Movie = require('./models/Movie');
const Review = require('./models/Review');
const Rating = require('./models/Rating');

// Import controllers
const homeController = require('./controllers/homeController');
const favoritesController = require('./controllers/favoritesController');
const searchController = require('./controllers/searchController');
const profileController = require('./controllers/profileController');
const signInController = require('./controllers/signInController');
const signUpController = require('./controllers/signUpController');
const logoutController = require('./controllers/logoutController');

// Create Express application
const app = express();
const PORT = process.env.PORT || 3000;
const upload = multer();

// Start Sequelize to synchronize models with the database
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

// Middleware: Session configuration
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: 'auto', httpOnly: true },
}));

// Middleware: Body parser for form data
app.use(express.urlencoded({ extended: true }));

// Middleware: Serve static files from "public" directory
app.use(express.static('public'));

// Set view engine
app.set('view engine', 'ejs');
app.use(express.json());

// Middleware: Check if user is logged in
function requireLogin(req, res, next) {
    if (!req.session.user) {
        res.redirect('/signIn');
    } else {
        next();
    }
}

// Routes
app.get('/', requireLogin, homeController.home);
app.get('/home', requireLogin, homeController.home);
app.get('/favorites', requireLogin, favoritesController.favorites);
app.get('/search', requireLogin, searchController.search);
app.get('/profile', requireLogin, profileController.getProfile);
app.post('/profile', requireLogin, profileController.postProfile);
app.get('/signIn', signInController.getSignIn);
app.post('/signIn', upload.none(), signInController.postSignIn);
app.get('/signUp', signUpController.getSignUp);
app.post('/signUp', upload.none(), signUpController.postSignUp);
app.post('/logout', upload.none(), logoutController.postLogout);

// Start the server
start();
