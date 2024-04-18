const Sequelize = require('sequelize')
const sequelize = require('../utils/database')
const  User = require('./User')

const Client = sequelize.define('Client', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

