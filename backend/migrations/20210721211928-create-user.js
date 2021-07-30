'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            args: true,
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pseudo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            args: true,
        }
      },
      nom: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      prenom: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "user"
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
      }
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('users');
  }
};