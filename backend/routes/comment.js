// Appel d'express
const express = require('express');

// Création d'un router avec express
const router = express.Router();

// Importation du controlller et des middleware
const commentCtrl = require('../controllers/comment');
const auth = require('../middleware/auth');

// Création de la route Login avec le middleware limiter
router.post('/create/:id', auth.body , commentCtrl.createComment);
router.delete('/delete/:id', auth.bodyUserIdQuery , commentCtrl.deleteComment)
router.put('/update/:id', commentCtrl.updateComment)

module.exports = router;