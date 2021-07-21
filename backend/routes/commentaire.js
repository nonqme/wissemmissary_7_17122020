// Appel d'express
const express = require('express');

// Création d'un router avec express
const router = express.Router();

// Importation du controlller et des middleware
const commentaireCtrl = require('../controllers/commentaire');
const auth = require('../middleware/auth');

router.get('/allcommentaires', auth,  commentaireCtrl.allCommentaires);
router.post('/post', commentaireCtrl.createCommentaire )
router.post('/delete', auth, commentaireCtrl.deleteCommentaire)


module.exports = router;