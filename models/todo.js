const Sequelize = require('sequelize')
const sequelize = require('../utils/database')

const user = sequelize.define('User', {
    id: {
        primaryKey: true,
        autoIncrement: false,
        allowNull: false,
        type: Sequelize.INTEGER
    }
})