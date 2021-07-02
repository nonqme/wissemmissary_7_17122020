const Message = require('../models/message');


exports.allMessages = (req, res, next) => {
    Message.findAll()
      .then(message => {
          return res.status(200).json({message});
      })
      .catch(error => res.status(500).json({ error }));
    };


