const Sequelize = require('sequelize');
require('../db/mysql');

module.exports = sequelize.define('User', {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    user_login: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
    },
    user_password: {
        type: Sequelize.STRING(60),
        allowNull: false,
    },
},
{
    createdAt: false,
    updatedAt: false,
})

