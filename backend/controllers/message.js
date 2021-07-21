const Message = require('../models/message');


exports.allMessages = (req, res, next) => {
  Message.findAll({where:{userID: req.query.id}})
    .then(message => res.status(200).json({message}))
    .catch(error => res.status(500).json({ error }));
    };

exports.createMessage = (req, res, next) => {
  Message.create({
    userID: req.body.userID,
    post: req.body.post,
  }
  )
  .then(() => res.status(201).json({ message: 'Post crée!' }))
  .catch(error => res.status(500).json({ error }));
};

exports.deleteMessage = (req, res, next) => {
  Message.destroy({where:{id: req.query.id}})
  .then(() => res.status(200).json({ message: 'Message supprimé !'}))
  .catch(error => res.status(500).json({ error }));
}


