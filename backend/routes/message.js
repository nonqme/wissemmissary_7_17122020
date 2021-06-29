// Appel d'express
const express = require('express');

// Création d'un router avec express
const router = express.Router();

// Importation du controlller et des middleware
const messageCtrl = require('../controllers/message');
const auth = require('../middleware/auth');

router.get('/allmessages', auth,  messageCtrl.allMessages);


module.exports = router;