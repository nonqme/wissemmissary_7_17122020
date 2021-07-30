// Appel d'express
const express = require('express');

// Création d'un router avec express
const router = express.Router();

// Importation du controlller et des middleware
const postCtrl = require('../controllers/post');
const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');

// Création de la route Login avec le middleware limiter
router.post('/create/:id', multer, auth.bodyUserId, postCtrl.createPost);
router.get('/allposts/:id', auth.query, postCtrl.getAllPost)
router.put('/update/:id', multer, auth.bodyUserIdQuery, postCtrl.updatePost)
router.delete('/delete/:id', auth.bodyUserIdQuery, postCtrl.deletePost)
router.get('/myposts/:id', auth.query, postCtrl.getMyPost)


module.exports = router;