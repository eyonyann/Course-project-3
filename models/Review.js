const Sequelize = require('sequelize')
const sequelize = require('../utils/database')

const Review = sequelize.define('Review', {
    review: {
        type: Sequelize.TEXT,
        allowNull: false
    }
}, {
    timestamps: false
});
