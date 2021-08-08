// Appel des models sequelize
const { Post, Comment, User, Like } = require('../models/');
// Appel du module Op de Sequelize
const Op = require('sequelize').Op;
// Appel de File system
const fs = require("fs");

// Création du controller createPost
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
        if (req.file !== undefined) {
          const filename = imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
              console.log('Image supprimée')
            });
          }
        res.status(500).json({error: error.errors[0].message})
    }) 
};

// Création du controller getAllPost
exports.getAllPost = (req, res, next) => {
    Post.findAll({
      where:{ userId: { [Op.ne]: req.params.id }},
       include: 
        ['user', 'likes', {model:Comment, as:'comments', include:[{model: User, as: 'commentUser'}]}]
    }) 
    .then(posts => res.status(200).json({ message:'Voila les posts', posts }))
    .catch(error => { 
      console.log(error)
        res.status(500).json({ error: error.errors[0].message})
    });
};

// Création du controller getAllPost
exports.getMyPost = (req, res, next) => {
  Post.findAll({ where: { userId: req.params.id },
    include: 
     ['user','likes', {model:Comment, as:'comments', include:[{model: User, as: 'commentUser'}]}]
 }) 
  .then(posts => res.status(200).json({ message:'Voila les posts', posts }))
  .catch(error => {
    console.log(error)
      res.status(500).json({ error: error.errors[0].message })
  });
};

// Création du controller updatePost
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
      res.status(400).json({ error: error.errors[0].message })
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
    res.status(500).json({ error: error.errors[0].message })
  })
}

// Création du controller deletePost
exports.deletePost = (req, res) => {
  Post.findOne({ where: { id: req.params.id }})
  .then(post => {
    if (post.bodyImageUrl !== null) {
      const filename = post.bodyImageUrl.split("/images")[1];
      fs.unlink(`images/${filename}`, () => {
        Post.destroy({ where: { id: req.params.id} })
        .then(() => res.status(200).json({ message: "Post supprimé" }))
        .catch(error => res.status(500).json({ error: error.errors[0].message }));
      });
    } else {
      Post.destroy({ where: { id: req.params.id} })
      .then(() => res.status(200).json({ message: "Post supprimé" }))
      .catch(error => res.status(500).json({ error: error.errors[0].message }));
    }
  })
  .catch(error => res.status(500).json({ error: error.errors[0].message }));
}

// Création du controller likePost
exports.likePost = (req, res) => {
  if (req.body.like == 1) {
    Like.findOne({ where: { postId: req.params.id, userId: req.body.userId }})
    .then(like => {
      if (like === null) {
        Like.create({
          userId: req.body.userId,
          postId: req.params.id,
        })
        .then(() => {
          Post.increment('like',{ by:1, where: {id: req.params.id}})
          .then(() => res.status(200).json({message:"Like!"}))
          .catch(error => res.status(400).json({error: error.message }))
        })
        .catch(error =>{ 
          console.log(error)
          res.status(400).json({ error: error.message })
      })
      } else {
        res.status(400).json({ message: "Vous avez déjà like ou dislike"})
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ error: error.message})
    })
  } else if (req.body.like == 0) {
    Like.findOne({ where: { postId: req.params.id, userId: req.body.userId }})
    .then(like => {
      if (like) {
        Like.destroy({ where: { postId: req.params.id, userId: req.body.userId }})
        .then(() => {
          Post.decrement('like',{ by:1, where: {id: req.params.id}})
          .then(() => res.status(200).json({message:"Like enlevé"}))
          .catch(error => res.status(400).json({error: error.message }))
        })
        .catch(error => res.status(400).json({ error: error.message }))
      } else {
        res.status(400).json({message:"Vous n'avez pas like"})
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ error: error.message})
    })
  }
}