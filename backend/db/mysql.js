const Sequelize = require('sequelize');

module.exports = sequelize = new Sequelize('groupomania', 'user', '090490', {
  host: 'localhost',
  dialect: 'mysql',
});