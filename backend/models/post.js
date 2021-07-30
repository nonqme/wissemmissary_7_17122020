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
    static associate({ User, Comment }) {
      this.hasMany(Comment, {foreignKey: 'postId', as: 'comments'})
      this.belongsTo(User, {foreignKey: 'userId', as: 'user' })

    }
    toJSON() {
      return { ...this.get(), password: undefined, role: undefined }
    }
  };
  Post.init({
    body: {
      type: DataTypes.STRING,
      allowNull: false
    },
    bodyImageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: 'posts',
    modelName: 'Post',
  });
  return Post;
};