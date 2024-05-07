const Sequelize = require('sequelize')
const sequelize = require('../utils/database')

const Rating = sequelize.define('Rating', {
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    movieId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Movies', // 'Movies' is the table name
            key: 'id',
        }
    },
    rating: {
        type: Sequelize.DECIMAL(3, 1),
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = Rating;