const jwktopem = require("jwk-to-pem");
const jwt = require("jsonwebtoken");
const jose = require("node-jose");
const fs = require("fs");
const { pathToFileURL } = require("url");

const keyStore = jose.JWK.createKeyStore();

keyStore.generate("RSA", 2048, { alg: "RS256", use: "sig" }).then((result) => {
    fs.writeFileSync(
        "keys.json",
        JSON.stringify(keyStore.toJSON(true), null, "  ")
    );
});

async function generateToken(payload) {
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

    payload.exp = Math.floor(Date.now() / 1000 + 1 * 60 * 60);
    payload.iat = Math.floor(Date.now() / 1000);

    for (const key in payload) {
        if (payload[key] === null) {
            delete payload[key];
        }
    }

    const token = await jose.JWS.createSign(opt, key)
        .update(JSON.stringify(payload))
        .final();

    return token;
}

async function verifyToken(req, res, next) {
    let token = req.headers.authorization;
    if (!token) {
        return res.status(403).json({ error: "No token provided" });
    }

    const decoded = token.toString().substring(7);
    const jwt_header = JSON.parse(
        Buffer.from(decoded.split(".")[0], "base64").toString()
    );

    const publicKey = jwktopem(jwt_header.jwk);
    const verified = jwt.verify(token.toString().substring(7), publicKey);

    if (verified) {
        req.user = verified;
        next();
    }
}

module.exports = { generateToken, verifyToken };
