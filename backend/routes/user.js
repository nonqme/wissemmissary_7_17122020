// Appel d'express
const express = require('express');

// Création d'un router avec express
const router = express.Router();

// Importation du controlller et des middleware
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Création de la route Login avec le middleware limiter
router.post('/login', userCtrl.readAccount);
router.post('/create', multer, userCtrl.createAccount);
router.delete('/delete/:id', auth.body, userCtrl.deleteAccount);
router.put('/update/:id', multer, auth.body, userCtrl.updateAccount);


module.exports = router;