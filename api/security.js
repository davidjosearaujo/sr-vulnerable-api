const jwt = require('jsonwebtoken');



key = 'abc';


function generateToken(user) {
    return jwt.sign(user, key, {expiresIn: '1h'})
}

function verifyToken(req, res, next) {
    let token = req.headers.authorization;
    if (!token) {
      return res.status(403).json({error: 'No token provided'});
    }

    token = token.substring(7);

    jwt.verify(token, key, (err, user) => {
      if (err) {
        return res.status(401).json({error: 'Failed to authenticate token'});
      }
  
      req.user = user;
      next();
    });
  }

  module.exports = {generateToken, verifyToken}