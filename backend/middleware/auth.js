// Appel de jsonwebtoken
const jwt = require('jsonwebtoken');

// Création du middleware d'authentification 
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      console.log(req.body.userId)
      console.log(jwt.verify(token, 'RANDOM_TOKEN_SECRET'))
      console.log(userId)
      throw 'Invalid user ID';
      
    } else {
      next();
    }
  } catch {
    console.log(req.headers.authorization)
    res.status(401).json({
      error: new Error('Invalid request!')
      
    });
  }
};