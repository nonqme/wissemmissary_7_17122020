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
        unique: {
            args: true,
        }
    },
    user_password: {
        type: Sequelize.STRING(60),
        allowNull: false,
    },
    user_email: {
        type: Sequelize.STRING(60),
        allowNull: false,
        unique: {
            args: true,
        }
    },
    user_firstname: {
        type: Sequelize.STRING(30),
        allowNull: false,
    },
    user_lastname: {
        type: Sequelize.STRING(30),
        allowNull: false,
    },
    user_birthdate: {
        type: Sequelize.DATE,
        allowNull: true,
    },
},
{
    createdAt: false,
    updatedAt: false,
})

