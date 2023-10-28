const jwt = require('jsonwebtoken');

key = 'abc';

function generateToken(user) {
    return jwt.sign(user, key, {expiresIn: '1h'})
}

function verifyToken(req, res, next) {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(403).send('No token provided');
    }
  
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.status(401).send('Failed to authenticate token');
      }
  
      req.user = user;
      next();
    });
  }

  module.exports = {generateToken, verifyToken}