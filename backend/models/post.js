'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Comment, Like }) {
      this.hasMany(Comment, {foreignKey: 'postId', as: 'comments'})
      this.belongsTo(User, {foreignKey: 'userId', as: 'user' })
      this.hasMany(Like, {foreignKey: 'postId', as: 'likes'})
    }
    toJSON() {
      return { ...this.get(), password: undefined, role: undefined, nom: undefined, prenom: undefined, email: undefined}
    }
  };
  Post.init({
    body: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^(?! )[ À-ÿ0-9A-Za-z?!')(-]*(?<! )$/,
          msg:'Charactère non autorisé'
        },
        notEmpty: {
          args: true,
          msg:'Veuillez remplir le champ de texte'
        },
      }
    },
    bodyImageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    like: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue:0
    },
  }, {
    sequelize,
    tableName: 'posts',
    modelName: 'Post',
  });
  return Post;
};