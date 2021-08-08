'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Post, User}) {
      this.belongsTo(Post, { foreignKey: 'postId', onDelete:'cascade', hooks: true})
      this.belongsTo(User, { foreignKey: 'userId', as: 'commentUser', onDelete:'cascade', hooks: true})
    }
    toJSON() {
      return { ...this.get(), password: undefined, role: undefined, nom: undefined, prenom: undefined, email: undefined}
    }
    
  };
  Comment.init({
    bodyComment: {
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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: 'comments',
    modelName: 'Comment',
  });
  return Comment;
};