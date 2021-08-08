// Appel d'express
const express = require('express');

// Création d'un router avec express
const router = express.Router();

// Importation du controlller et des middleware
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const userLimit = require('../middleware/limiter')

// Création de la route login avec le middleware limiter et le controller readAccount
router.post('/login', userLimit.limiter, userLimit.speedLimiter, userCtrl.readAccount);

// Création de la route create avec le middleware limiter, multer et le controller createAccount
router.post('/create', userLimit.limiter, userLimit.speedLimiter, multer, userCtrl.createAccount);

// Création de la route delete avec le middleware auth et le controller deleteAccount
router.delete('/delete/:id', userLimit.limiter, userLimit.speedLimiter, auth.body, userCtrl.deleteAccount);

// Création de la route Login avec le middleware limiter, multer, auth et le controller updateAccount
router.put('/update/:id', userLimit.limiter, userLimit.speedLimiter, multer, auth.body, userCtrl.updateAccount);


module.exports = router;