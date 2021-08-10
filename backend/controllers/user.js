// Appel des models sequelize
const { User } = require('../models/');

// Appel de File system
const fs = require("fs");

// Appel de bcrypt
const bcrypt = require('bcrypt');

// Appel de Jsonwebtoken
const jwt = require('jsonwebtoken');

// Appel de CryptoJS
const CryptoJS = require("crypto-js");

// Appel de MaskData
const MaskData = require('maskdata');

// Appel de dotenv
require('dotenv').config()

// Création du controller createAccount
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
  if ((emailRegex.test(req.body.email) === true ) && (req.body.password.length >= 8) && (req.body.password.length <= 20) && (passwordRegex.test(req.body.password) === true )) {
    bcrypt.hash(req.body.password, parseInt(process.env.SALT))
      .then(hash => {
        const key = CryptoJS.enc.Hex.parse(process.env.CRYPTO_KEY);
        const iv = CryptoJS.enc.Hex.parse(process.env.CRYPTO_IV);
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
              res.status(400).json({error: error.errors[0].message})
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
              res.status(400).json({ error: 'Pseudo ou Email déjà utilisé.' })
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
              res.status(400).json({error: error.errors[0].message})
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
        res.status(500).json({error: error.errors[0].message})
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

// Création du controller readAccount
exports.readAccount = (req, res, next) => {
  const emailRegex = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
  if (emailRegex.test(req.body.email) === true ) {
    const email = req.body.email;
    const key = CryptoJS.enc.Hex.parse(process.env.CRYPTO_KEY)
    const iv = CryptoJS.enc.Hex.parse(process.env.CRYPTO_IV);
    const encryptmail = CryptoJS.AES.encrypt(email, key, {iv: iv}).toString()
    const decryptmail = CryptoJS.AES.decrypt( encryptmail, key, {iv: iv}).toString(CryptoJS.enc.Utf8)
    const emailMaskOptions = {
      maskWith: "*", 
      unmaskedStartCharactersBeforeAt: 0,
      unmaskedEndCharactersAfterAt: 257, // Give a number which is more than the characters after @
      maskAtTheRate: false
  };
  const maskedEmail = MaskData.maskEmail2(decryptmail, emailMaskOptions);
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
              process.env.JWT_SECRET,
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({error: error.errors[0].message}));
      })
    .catch(error => res.status(500).json({error: error.errors[0].message}));
  } else {
    res.status(400).json({ error: "L'email doit être au format xxx@xxxx.xxx"})
  }  
};

// Création du controller updateAccount
exports.updateAccount = (req, res) => {
  const emailRegex2 = /^[A-Za-z0-9@.]/;
  const emailRegex = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
  const key = CryptoJS.enc.Hex.parse(process.env.CRYPTO_KEY)
  const iv = CryptoJS.enc.Hex.parse(process.env.CRYPTO_IV);
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
      fs.unlink(`images/${filename}`, () => {
        console.log('Image supprimée')
      });
    }
    if ((user.email !== req.body.email) && (emailRegex.test(req.body.email) === true) && ((emailRegex2.test(req.body.email)) === true)) {
      user.email = encryptmail
    } else {
      const filename = imageUrl.split("/images/")[1];
      if (req.file) {
        fs.unlink(`images/${filename}`, () => {
          console.log('Image supprimée')
        });
      }
      return res.status(400).json({ error: "L'email doit être au format xxx@xxx.xxx et ne doit pas contenir de caractères speciaux!" })
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
      const decryptmail = CryptoJS.AES.decrypt( encryptmail, key, {iv: iv}).toString(CryptoJS.enc.Utf8)
      const emailMaskOptions = {
        maskWith: "*", 
        unmaskedStartCharactersBeforeAt: 0,
        unmaskedEndCharactersAfterAt: 257, // Give a number which is more than the characters after @
        maskAtTheRate: false
    };
    const maskedEmail = MaskData.maskEmail2(decryptmail, emailMaskOptions);
      res.status(200).json({
        message: "Votre profil a bien été modifié",
        imageUrl: user.imageUrl,
        pseudo: user.pseudo,
        email: maskedEmail,
        nom: user.nom,
        prenom: user.prenom
    })
    })
    .catch(error => { 
      res.status(400).json({error: error.errors[0].message})
      const filename = imageUrl.split("/images/")[1];
      if (req.file) {
        fs.unlink(`images/${filename}`, () => {
          console.log('Image supprimée')
        });
      }
    });
  })
  .catch(error => { 
    res.status(500).json({error: error.errors[0].message})
    const filename = imageUrl.split("/images/")[1];
    if (req.file) {
      fs.unlink(`images/${filename}`, () => {
        console.log('Image supprimée')
      });
    }
  });
}

// Création du controller deleteAccount
exports.deleteAccount = (req, res) => {
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
    .catch(error => res.status(400).json({error: error.errors[0].message}));
  })
  .catch(error => res.status(500).json({error: error.errors[0].message}));  
}


