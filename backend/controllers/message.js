const Message = require('../models/message');


exports.allMessages = (req, res, next) => {

    Message.findAll({where:{userID: req.query.id}})
      .then(message => {
        return res.status(200).json({message});
      })
      .catch(error => res.status(500).json({ error }));
    };

exports.createMessage = (req, res, next) => {
  Message.create({
    userID: req.body.id,
    post: req.body.post,
  }
  )
  .then(() => res.status(201).json({ message: 'Post crée!' }))
  .catch(error => { res.status(400).json({ error })
      })
    .catch(error => res.status(500).json({ error }));
};


