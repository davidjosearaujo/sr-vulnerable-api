const jwt = require("jsonwebtoken");
const jose = require("node-jose");
const jwktopem = require("jwk-to-pem");
const fs = require("fs");
const { decode } = require("punycode");

key = "tokenkey";

const keyStore = jose.JWK.createKeyStore();

keyStore.generate("RSA", 2048, { alg: "RS256", use: "sig" }).then((result) => {
    fs.writeFileSync(
        "keys.json",
        JSON.stringify(keyStore.toJSON(true), null, "  ")
    );
});

async function generateToken(user) {
    const ks = fs.readFileSync("keys.json");
    const keyStore = await jose.JWK.asKeyStore(ks.toString());

    const [key] = keyStore.all({ use: "sig" });

    const opt = {
        compact: true,
        jwk: key,
        fields: {
            typ: "jwt",
            jwk: {
                kty: key.kty,
                kid: key.kid,
                use: "sig",
                alg: "RS256",
                e: key.toJSON().e,
                n: key.toJSON().n,
            },
        },
    };
    const payload = JSON.stringify({
        username: user.username,
        id: user.id,
        exp: Math.floor(Date.now() / 1000 + 1 * 60 * 60),
        iat: Math.floor(Date.now() / 1000),
    });

    const token = await jose.JWS.createSign(opt, key).update(payload).final();

    return token;
}

async function verifyToken(req, res, next) {
    let token = req.headers.authorization;
    if (!token) {
        return res.status(403).json({ error: "No token provided" });
    }

    decoded = token.toString().substring(7);

    jwt_header = JSON.parse(
        Buffer.from(decoded.split(".")[0], "base64").toString()
    );

    const publicKey = jwktopem(jwt_header.jwk);

    decoded = jwt.verify(token.toString().substring(7), publicKey);

    if (decoded) {
        req.user = {
            username: decoded.username,
            id: decoded.id,
        };
        next();
    }
}

module.exports = { generateToken, verifyToken };
