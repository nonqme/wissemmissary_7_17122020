const Sequelize = require('sequelize');
require('../db/mysql');

module.exports = sequelize.define('Message', {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    userid: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        unique: true,
    },
    post: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
},
{
    createdAt: false,
    updatedAt: false,
})

