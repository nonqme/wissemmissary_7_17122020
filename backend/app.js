// Appel d'express
const express = require('express');

// Appel d'helmet
const helmet = require("helmet");

// Import de la route user
const userRoutes = require('./routes/user');

// Import de la route post
const postRoutes = require('./routes/post');

// Import de la route comment
const commentRoutes = require('./routes/comment');

// Appel du module express path
const path = require('path');

// Création de l'application
const app = express();

// Initialisation d'helmet
app.use(helmet());

// Initialisation des headers qui nous permette d'accéder à notre API depuis n'importe quelle origine, d'ajouter les headers mentionnés aux requêtes envoyées vers notre API et d'envoyer des requêtes avec les méthodes mentionnées 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

// Initialisation d'express.json pour parser les requêtes envoyées par le client
app.use(express.json({ limit: '10kb'}));
app.use(express.urlencoded({
    extended: true
}));

// Initialisation de la route user
app.use('/api/auth', userRoutes);

// Initialisation de la route post
app.use('/api/post', postRoutes);

// Initialisation de la route comment
app.use('/api/comment', commentRoutes);

// Initialisation de la route des images
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;