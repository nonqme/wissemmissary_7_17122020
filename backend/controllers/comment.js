// Appel des models sequelize
const { Comment } = require('../models/');

// Création du controller createComment
exports.createComment = (req, res, next) => {
    Comment.create({
      userId: req.body.userId,
      postId: req.body.postId,
      bodyComment: req.body.bodyComment,
    })
    .then(() => res.status(201).json({ message: 'Commentaire crée!' }))
    .catch(error => {
      console.log(error)
      res.status(500).json({error: error.errors[0].message})
  });
};

// Création du controller deleteComment
exports.deleteComment = (req, res) => {
  Comment.findOne({ where: { id: req.params.id }})
  .then(() => {
    Comment.destroy({ where: { id: req.params.id} })
    .then(() => res.status(200).json({ message: "Commentaire supprimé" }))
    .catch(error => res.status(400).json({error: error.errors[0].message}));
  })
  .catch(error => res.status(500).json({error: error.errors[0].message}));
};

// Création du controller updateComment
exports.updateComment = (req, res) => {
  Comment.findOne({ where: { id: req.params.id } })
  .then(comment => {
    if (comment.bodyComment !== req.body.bodyComment) {
      comment.bodyComment = req.body.bodyComment
    }
    comment.save({ fields: ["bodyComment"] })
    .then(() => {
      res.status(200).json({
        message: "Votre commentaire a bien été modifié",
    })
    })
    .catch(error => { 
      console.log(error)
      res.status(400).json({error: error.errors[0].message})
    });
  })
  .catch(error => {
    res.status(500).json({error: error.errors[0].message})
})
}