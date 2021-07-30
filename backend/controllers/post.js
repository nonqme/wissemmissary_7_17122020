const { Post, Comment, User } = require('../models/');
const Op = require('sequelize').Op;
const fs = require("fs");


exports.createPost = (req, res, next) => {
    let imageUrl;
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
    }
    else {
      imageUrl = null;
    }
    Post.create({
      userId: req.body.userId,
      body: req.body.body,
      bodyImageUrl: imageUrl,
    })
    .then(() => res.status(201).json({ message: 'Post crée!' }))
    .catch(error => {
        const filename = imageUrl.split("/images/")[1];
        if (req.file) {
            fs.unlink(`images/${filename}`, () => {
              console.log('Image supprimée')
            });
          }
        res.status(500).json({ error })
    });
};

exports.getAllPost = (req, res, next) => {
    Post.findAll({
      where:{ userId: { [Op.ne]: req.params.id }},
       include: 
        ['user', {model:Comment, as:'comments', include:[{model: User, as: 'commentUser'}]}]
    }) 
    .then(posts => res.status(200).json({ message:'Voila les posts', posts }))
    .catch(error => { 
      console.log(error)
        res.status(500).json({ error })
    });
};

exports.getMyPost = (req, res, next) => {
  Post.findAll({ where: { userId: req.params.id },
    include: 
     ['user', {model:Comment, as:'comments', include:[{model: User, as: 'commentUser'}]}]
 }) 
  .then(posts => res.status(200).json({ message:'Voila les posts', posts }))
  .catch(error => {
    console.log(error)
      res.status(500).json({ error })
  });
};

exports.updatePost = (req, res) => {
  let bodyImageUrl;
  if (req.file) {
    console.log(req.file)
    bodyImageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
  }
  else {
    bodyImageUrl = null;
  }
  Post.findOne({ where: { id: req.params.id } })
  .then(post => {
    if (post.bodyImageUrl !== null) {
      const filename = post.bodyImageUrl.split("/images/")[1];
      console.log(filename)
      fs.unlink(`images/${filename}`, () => {
        console.log('Image supprimée')
      });
    }
    if (post.body !== req.body.body) {
      post.body = req.body.body
    }
    if (post.bodyImageUrl !== bodyImageUrl) {
    post.bodyImageUrl = bodyImageUrl
    }
    post.save({ fields: ["body", "bodyImageUrl"] })
    .then(() => {
      res.status(200).json({
        message: "Votre post a bien été modifié",
        BodyImageUrl: post.bodyImageUrl,
    })
    })
    .catch(error => { 
      res.status(400).json({ error })
      console.log(bodyImageUrl)
      if (bodyImageUrl !== null) {
        const filename = bodyImageUrl.split("/images")[1];
        fs.unlink(`images/${filename}`, () => {
          console.log('Image supprimée')
        });
      } else if (req.file) {
        fs.unlink(`images/${filename}`, () => {
          console.log('Image supprimée')
        });
      }
    });
  })
  .catch(error => {
    res.status(500).json({error})
  })
}

exports.deletePost = (req, res) => {
  Post.findOne({ where: { id: req.params.id }})
  .then(post => {
    console.log(post.bodyImageUrl)
    if (post.bodyImageUrl !== null) {
      const filename = post.bodyImageUrl.split("/images")[1];
      fs.unlink(`images/${filename}`, () => {
        Post.destroy({ where: { id: req.params.id} })
        .then(() => res.status(200).json({ message: "utilisateur supprimé" }))
        .catch(error => res.status(500).json({ error }));
      });
    } else {
      Post.destroy({ where: { id: req.params.id} })
      .then(() => res.status(200).json({ message: "utilisateur supprimé" }))
      .catch(error => res.status(500).json({ error }));
    }
  })
  .catch(error => res.status(500).json({ error }));
};
