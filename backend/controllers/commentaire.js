const Commentaire = require('../models/commentaire');


exports.allCommentaires = (req, res, next) => {
    Commentaire.findAll({where:{postId: req.query.id}})
    .then(message => res.status(200).json({message}))
    .catch(error => res.status(500).json({ error }));
    };

exports.createCommentaire = (req, res, next) => {
  Commentaire.create({
    userId: req.body.userId,
    postId: req.body.postId,
    commentaire: req.body.commentaire
  })
  .then(() => res.status(201).json({ message: 'Commentaire crée!' }))
  .catch(error => res.status(500).json({ error }));
};

exports.deleteCommentaire = (req, res, next) => {
  Commentaire.destroy({where:{id: req.query.id}})
  .then(() => res.status(200).json({ message: 'Message supprimé !'}))
  .catch(error => res.status(500).json({ error }));
}
