// Appel d'express
const express = require('express');

// Création d'un router avec express
const router = express.Router();

// Importation du controlller et des middleware
const userCtrl = require('../controllers/users');

// Création de la route Login avec le middleware limiter
router.post('/login', userCtrl.login);

module.exports = router;