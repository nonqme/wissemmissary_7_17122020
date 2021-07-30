const { User, Comment, Post } = require('../models/');

const fs = require("fs");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Création de la route signup
exports.createAccount = async (req, res, next) => {
  let imageUrl;
  if (req.file) {
    imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
  }
  else {
    imageUrl = `${req.protocol}://${req.get("host")}/images/default.png`;
  }
  const db = await User.findAll()
  bcrypt.hash(req.body.password, parseInt(10))
    .then(hash => {
      console.log(db.length)
      if (db.length === 0) {
        User.create(
          {
            email: req.body.email,
            password: hash,
            pseudo: req.body.pseudo,
            nom: req.body.nom,
            prenom: req.body.prenom,
            role: 'admin',
            imageUrl: imageUrl
          }
        )
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => {
          if ((error.name) === ("SequelizeUniqueConstraintError")) {
            res.status(400).json({ error: 'Vous avez déjà un compte.' })
            const filename = imageUrl.split("/images/")[1];
            if (req.file) {
              fs.unlink(`images/${filename}`, () => {
                console.log('Image supprimée')
              });
            }
          }
        });
      } else {
        User.create(
          {
            email: req.body.email,
            password: hash,
            pseudo: req.body.pseudo,
            nom: req.body.nom,
            prenom: req.body.prenom,
            role: 'user',
            imageUrl: imageUrl
          }
        )
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => {
          if ((error.name) === ("SequelizeUniqueConstraintError")) {
            res.status(400).json({ error: 'Vous avez déjà un compte.' })
            const filename = imageUrl.split("/images/")[1];
            if (req.file) {
              fs.unlink(`images/${filename}`, () => {
                console.log('Image supprimée')
              });
            }
          }
        });
      }
    })
    .catch(error => {
      res.status(500).json({ error })
      const filename = imageUrl.split("/images/")[1];
      if (req.file) {
        fs.unlink(`images/${filename}`, () => {
          console.log('Image supprimée')
        });
      }
    });
};

exports.readAccount = (req, res, next) => {
  const email = req.body.email;
  User.findOne({ where: { email: email }})
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Email ou mot de pass INCORRECT !' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Email ou mot de pass INCORRECT !' });
          }
          res.status(200).json({
            pseudo: user.pseudo,
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
            role: user.role,
            imageUrl: user.imageUrl,
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

exports.updateAccount = (req, res) => {
  let imageUrl;
  if (req.file) {
    imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
  }
  else {
    imageUrl = `${req.protocol}://${req.get("host")}/images/default.png`;
  }
  User.findOne({ where: { id: req.params.id } })
  .then(user => {
    if (user.imageUrl !== (`${req.protocol}://${req.get("host")}/images/default.png`)) {
      const filename = user.imageUrl.split("/images/")[1];
      console.log(filename)
      fs.unlink(`images/${filename}`, () => {
        console.log('Image supprimée')
      });
    }
    console.log(req.body.id)
    if (user.email !== req.body.email) {
      user.email = req.body.email
    }
    if (user.pseudo !== req.body.pseudo) {
      user.pseudo = req.body.pseudo
    }
    if (user.nom !== req.body.nom) {
      user.nom = req.body.nom
    }
    if (user.prenom !== req.body.prenom) {
      user.prenom = req.body.prenom
    }
    if (user.imageUrl !== imageUrl) {
     user.imageUrl = imageUrl
    }
    user.save({ fields: ["pseudo", "email", "nom", "prenom", "imageUrl"] })
    .then(() => {
      res.status(200).json({
        message: "Votre profil a bien été modifié",
        imageUrl: user.imageUrl,
    })
    })
    .catch(error => { 
      res.status(400).json({ error })
      const filename = imageUrl.split("/images/")[1];
      if (req.file) {
        fs.unlink(`images/${filename}`, () => {
          console.log('Image supprimée')
        });
      }
    });
  })
  .catch(error => { 
    res.status(500).json({ error })
    const filename = imageUrl.split("/images/")[1];
    if (req.file) {
      fs.unlink(`images/${filename}`, () => {
        console.log('Image supprimée')
      });
    }
  });
}

exports.deleteAccount = (req, res) => {
  Comment.findAll({ where: { userId: req.params.id }})
  .then(() => {
    Comment.destroy({ where: { userId: req.params.id} })
    .then(() => {
      Post.findAll({ where: { userId: req.params.id }})
      .then(posts => {
        posts.forEach(post=> {
          if (post.bodyImageUrl !== null) {
            const filename = post.bodyImageUrl.split("/images")[1];
            fs.unlink(`images/${filename}`, () => {
            })
          }
        })
        Post.destroy({ where: { userId: req.params.id} })
        .then(() => {
          const defaultUrl = `${req.protocol}://${req.get("host")}/images/default.png`;
          User.findOne({ where: { id: req.params.id }})
          .then(user => {
            if (user.imageUrl !== defaultUrl) {
              const filename = user.imageUrl.split("/images")[1];
              fs.unlink(`images/${filename}`, () => {
              });
            }
            User.destroy({ where: { id: req.params.id} })
            .then(() => res.status(200).json({ message: "utilisateur supprimé" }))
            .catch(error => res.status(400).json({ error }));
          })
          .catch(error => res.status(500).json({ error }));  
        })
        .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error })); 
    })
    .catch(error => res.status(500).json({ error }));
  })
  .catch(error => res.status(500).json({ error }));
};


