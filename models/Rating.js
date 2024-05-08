const Sequelize = require('sequelize')
const sequelize = require('../utils/database')

const Rating = sequelize.define('Rating', {
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'users', // 'Movies' is the table name
            key: 'id',
        }
    },
    movieId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'movies', // 'Movies' is the table name
            key: 'id',
        }
    },
    rating: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = Rating;