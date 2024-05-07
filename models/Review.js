const Sequelize = require('sequelize')
const sequelize = require('../utils/database')

const Review = sequelize.define('Review', {
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
    reviewEpigraph: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    reviewText: {
        type: Sequelize.TEXT,
        allowNull: false
    },
}, {
    timestamps: false
});

module.exports = Review;