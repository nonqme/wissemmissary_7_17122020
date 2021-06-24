const db = require('../models/users');

exports.login = (req, res, next) => {
    console.log(req.body.user_name, req.body.user_password);
    db.findAll()
    .then(Users => res.send(Users))
    res.status(201).json({
      message: 'Objet créé !'
    });
}