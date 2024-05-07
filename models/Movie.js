const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Movie = sequelize.define('Movie', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    director: {
        type: Sequelize.STRING
    },
    country: {
        type: Sequelize.STRING
    },
    year: {
        type: Sequelize.INTEGER
    },
    description: {
        type: Sequelize.TEXT
    },
    rating: {
        type: Sequelize.DECIMAL(3, 1)
    },
    countOfRatings: {
        type: Sequelize.INTEGER
    },
    poster: {
        type: Sequelize.STRING
    }
}, {
    timestamps: false
});

module.exports = Movie;