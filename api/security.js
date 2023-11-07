const jwt = require("jsonwebtoken");

key = "tokenkey";

function generateToken(user) {
    return jwt.sign(user, key, { expiresIn: "1h" });
}

function verifyToken(req, res, next) {
    let token = req.headers.authorization;
    if (!token) {
        return res.status(403).json({ error: "No token provided" });
    }

    token = token.substring(7);

    // TODO: verifyToken -> verificar mal o token
    token = jwt.decode(token);

    
  
    req.user = {
        username: token.username,
        id: token.id,
    };
    next();
}

module.exports = { generateToken, verifyToken };
