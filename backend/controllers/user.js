const User = require('../models/user');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = (req, res, next) => {
  const Login = req.body.user_login
  User.findOne({ where: { user_login: Login }})
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur ou mot de pass INCORRECT !' });
      }
      bcrypt.compare(req.body.user_password, user.user_password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Utilisateur ou mot de pass INCORRECT !' });
          }
          res.status(200).json({
            firstname: user.user_firstname,
            lastname: user.user_lastname,
            id: user.id,
            token: jwt.sign(
              { id: user.id },
              'RANDOM_TOKEN_SECRET',
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
  };
  
    // Création de la route signup
exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.user_password, parseInt(10))
    .then(hash => {
      User.create(
        {
          user_login: req.body.user_login,
          user_password: hash,
          user_email: req.body.user_email,
          user_firstname: req.body.user_firstname,
          user_lastname: req.body.user_lastname,
          user_birthdate: req.body.user_birthdate,
        }
      )
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => {
          if ((error.name) === ("SequelizeUniqueConstraintError")) {
            res.status(400).json({ error: 'Vous avez déjà un compte.' })
          }
        });
    })
    .catch(error => res.status(500).json({ error }));
};
