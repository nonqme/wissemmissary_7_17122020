// Appel de jsonwebtoken
const jwt = require('jsonwebtoken');
const { User } = require('../models/');

// Création du middleware d'authentification 
exports.body = async(req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.id;
    if (((req.body.id) && parseInt(req.body.id) !== userId) || ((req.params.id) && parseInt(req.param.id != userId))) {
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

exports.query = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.id;
    if (((req.query.id) && parseInt(req.query.id) !== userId) || ((req.params.id) && parseInt(req.param.id != userId))) {
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

exports.bodyUserId = (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
      const userId = decodedToken.id;  
      if (((req.body.userId) && (parseInt(req.body.userId) !== userId)) || ((req.params.id) && (parseInt(req.params.id) != userId))) {
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

exports.bodyUserIdQuery = async(req, res, next) => {
  const userRole = await User.findOne({ where: { id: req.body.userId }})
  if (userRole.role === 'user') {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
      const userId = decodedToken.id; 
      if (((req.body.userId) && parseInt(req.body.userId) !== userId) || ((req.query.userId) && parseInt(req.query.UserId != userId))) {
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
      const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
      const userId = decodedToken.id;
      if (((req.body.userId) && parseInt(req.body.userId) !== userId) || ((req.query.userId) && parseInt(req.query.UserId != userId))) {
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