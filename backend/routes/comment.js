// Appel d'express
const express = require('express');

// Création d'un router avec express
const router = express.Router();

// Importation du controlller et des middleware
const commentCtrl = require('../controllers/comment');
const auth = require('../middleware/auth');

// Création de la route create avec le middleware auth et le controller createComment
router.post('/create/:id', auth.body , commentCtrl.createComment);

// Création de la route delete avec le middleware auth et le controller deleteComment
router.delete('/delete/:id', auth.bodyUserIdQuery , commentCtrl.deleteComment)

// Création de la route update avec le middleware auth et le controller updateComment
router.put('/update/:id', auth.bodyUserIdQuery, commentCtrl.updateComment)

module.exports = router;