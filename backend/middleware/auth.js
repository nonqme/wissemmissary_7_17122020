// Appel de jsonwebtoken
const jwt = require('jsonwebtoken');

// Appel du model sequelize
const { User } = require('../models/');

// Appel de dotenv
require('dotenv').config()

// Création du middleware d'authentification req.body et req.params
exports.body = async(req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;
    if (((req.body.id) && (parseInt(req.body.id)) !== userId) || ((req.params.id) && (parseInt(req.params.id) !== userId))) {
      throw 'Invalid user ID';      
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
      
    });
  }
};

// Création du middleware d'authentification req.query et req.params
exports.query = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;
    if (((req.query.id) && (parseInt(req.query.id)) !== userId) || ((req.params.id) && (parseInt(req.params.id) !== userId))) {
      throw 'Invalid user ID';      
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
      
    });
  }
};

// Création du middleware d'authentification req.body.userId et req.params.userId
exports.bodyUserId = (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decodedToken.id;  
      if (((req.body.userId) && (parseInt(req.body.userId)) !== userId) || ((req.params.userId) && (parseInt(req.params.userId) !== userId))) {
        throw 'Invalid user ID';      
      } else {
        next();
      }
    } catch {
      res.status(401).json({
        error: new Error('Invalid request!')      
      });
      }
};

// Création du middleware d'authentification req.body.userId et req.query.userId et Admin
exports.bodyUserIdQuery = async(req, res, next) => {
  const userRole = await User.findOne({ where: { id: req.body.userId }})
  if (userRole.role === 'admin') {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decodedToken.id; 
      if (((req.body.userId) && (parseInt(req.body.userId)) !== userId)) {
        throw 'Invalid user ID';      
      } else {
        next();
      }
    } catch {
      res.status(401).json({
        error: new Error('Invalid request!')
      });
    }
  } else {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decodedToken.id;
      console.log(userId)
      console.log(req.body.userId)
      console.log(req.query.userId)
      if (((req.body.userId) && (parseInt(req.body.userId)) !== userId) || ((req.query.userId) && (parseInt(req.query.userId) !== userId))) {
        throw 'Invalid user ID';      
      } else {
        next();
      }
    } catch {
      res.status(401).json({
        error: new Error('Invalid request!')
        
      });
    }
  }
};