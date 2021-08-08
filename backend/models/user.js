'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Post, Comment }) {
      this.hasMany(Post, { foreignKey: 'userId', as: 'user'})
      this.hasMany(Comment, { foreignKey: 'userId', as: 'commentUser'})
    }
    toJSON() {
      return { ...this.get(), password: undefined, role: undefined, nom: undefined, prenom: undefined, email: undefined}
    }
  };
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
          args: true,
      },
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
      },
      validate: {
        isAlphanumeric: {
          args:true,
          msg:'Charactère non autorisé dans le pseudo',
        },
      }
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: {
          args:true,
          msg:'Charactère non autorisé dans le nom',
        },
      }
    },
    prenom: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: {
          args:true,
          msg:'Charactère non autorisé dans le prénom',
        },
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: true,
      }
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'users',
    modelName: 'User',
    createdAt: false,
    updatedAt: false,
    onDelete:'cascade'
  });
  return User;
};