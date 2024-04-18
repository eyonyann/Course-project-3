const Sequelize = require('sequelize')
const sequelize = require('../utils/database')

const Rating = sequelize.define('Rating', {
    rating: {
        type: Sequelize.DECIMAL(3, 1),
        allowNull: false
    }
}, {
    timestamps: false
});
