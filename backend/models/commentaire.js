const Sequelize = require('sequelize');
require('../db/mysql');

module.exports = sequelize.define('Commentaire', {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
    },
    postId: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
    },
    commentaire: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
},
{
    createdAt: false,
    updatedAt: false,
})

