const Sequelize = require('sequelize')
const sequelize = require('../utils/database')

const Review = sequelize.define('ReviewLike', {
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'users', // 'Movies' is the table name
            key: 'id',
        }
    },
    reviewId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'reviews', // 'Movies' is the table name
            key: 'id',
        }
    }
}, {
    timestamps: false
});

module.exports = Review;