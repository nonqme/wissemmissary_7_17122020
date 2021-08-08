// Appel d'express
const express = require('express');

// Création d'un router avec express
const router = express.Router();

// Importation du controlller et des middleware
const postCtrl = require('../controllers/post');
const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');

// Création de la route create avec le middleware multer, auth et le controller createPost
router.post('/create/:id', multer, auth.bodyUserId, postCtrl.createPost);

// Création de la route allposts avec le middleware auth et le controller getAllPost
router.get('/allposts/:id', auth.query, postCtrl.getAllPost)

// Création de la route update avec le middleware multer, auth et le controller updatePost
router.put('/update/:id', multer, auth.bodyUserIdQuery, postCtrl.updatePost)

// Création de la route delete avec le middleware auth et le controller deletePost
router.delete('/delete/:id', auth.bodyUserIdQuery, postCtrl.deletePost)

// Création de la route myposts avec le middleware auth et le controller getMyPost
router.get('/myposts/:id', auth.query, postCtrl.getMyPost)

// Création de la route like avec le middleware auth et le controller likePost
router.post('/like/:id', auth.bodyUserIdQuery, postCtrl.likePost)


module.exports = router;