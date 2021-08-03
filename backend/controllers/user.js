const { User, Comment, Post, Like } = require('../models/');

const fs = require("fs");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const CryptoJS = require("crypto-js");
const MaskData = require('maskdata');

// Création de la route signup
exports.createAccount = async (req, res, next) => {
  const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  const emailRegex = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
  let imageUrl;
  if (req.file) {
    imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
  }
  else {
    imageUrl = `${req.protocol}://${req.get("host")}/images/default.png`;
  }
  const db = await User.findAll()
  console.log(req.body.password.length)
  if ((emailRegex.test(req.body.email) === true ) && (req.body.password.length >= 8) && (req.body.password.length <= 20) && (passwordRegex.test(req.body.password) === true )) {
    bcrypt.hash(req.body.password, parseInt(10))
      .then(hash => {
        const key = CryptoJS.enc.Hex.parse("000102030405060708090a0b0c0d0e0f")
        const iv = CryptoJS.enc.Hex.parse("101112131415161718191a1b1c1d1e1f");
        const encryptmail = CryptoJS.AES.encrypt(req.body.email, key, {iv: iv}).toString()
        if (db.length === 0) {
          User.create(
            {
              email: encryptmail,
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
            } else if ((error.name) === ("SequelizeValidationError")) {
              console.log(error)
              res.status(400).json({error: error.errors[0].message})
              const filename = imageUrl.split("/images/")[1];
              if (req.file) {
                fs.unlink(`images/${filename}`, () => {
                  console.log('Image supprimée')
                });
              }
            } else {
              res.status(400).json(error.message)
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
              email: encryptmail,
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
      })
  } else {
    res.status(400).json({ error: "L'email doit être au format xxx@xxxx.xxx, le mot de pass doit être compris entre 8 et 20 et doit contenir 1 majuscule, 1 minuscule, 1 charactère special et un chiffre minimum"})
    const filename = imageUrl.split("/images/")[1];
    if (req.file) {
      fs.unlink(`images/${filename}`, () => {
        console.log('Image supprimée')
      }); 
    }     
  } 
};

exports.readAccount = (req, res, next) => {
  const emailRegex = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
  const email = req.body.email;
  const key = CryptoJS.enc.Hex.parse("000102030405060708090a0b0c0d0e0f")
  const iv = CryptoJS.enc.Hex.parse("101112131415161718191a1b1c1d1e1f");
  const encryptmail = CryptoJS.AES.encrypt(email, key, {iv: iv}).toString()
  const decryptmail = CryptoJS.AES.decrypt( encryptmail, key, {iv: iv}).toString(CryptoJS.enc.Utf8)
  const emailMaskOptions = {
    maskWith: "*", 
    unmaskedStartCharactersBeforeAt: 0,
    unmaskedEndCharactersAfterAt: 257, // Give a number which is more than the characters after @
    maskAtTheRate: false
};
const maskedEmail = MaskData.maskEmail2(decryptmail, emailMaskOptions);
  if (emailRegex.test(req.body.email) === true ) {
    User.findOne({ where: { email: encryptmail }})
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
            email: maskedEmail,
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
  } else {
    res.status(400).json({ error: "L'email doit être au format xxx@xxxx.xxx"})
    const filename = imageUrl.split("/images/")[1];
    if (req.file) {
      fs.unlink(`images/${filename}`, () => {
        console.log('Image supprimée')
      }); 
    }     
  }  
};

exports.updateAccount = (req, res) => {
  const emailRegex = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
  const key = CryptoJS.enc.Hex.parse("000102030405060708090a0b0c0d0e0f")
  const iv = CryptoJS.enc.Hex.parse("101112131415161718191a1b1c1d1e1f");
  const encryptmail = CryptoJS.AES.encrypt(req.body.email, key, {iv: iv}).toString()
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
    if ((user.email !== req.body.email) && (emailRegex.test(req.body.email) === true)) {
      user.email = encryptmail
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
  Like.destroy({ where: { userId: req.params.id}})
  .then(() => {
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
  })
  .catch(error => res.status(400).json({ error }))
}


