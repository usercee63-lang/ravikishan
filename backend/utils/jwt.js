const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const ACCESS_TTL = "7d";
const TEMP_TTL = "5m";

function newTokenId() {
  return crypto.randomBytes(12).toString("hex");
}

function signAccessToken(user) {
  return jwt.sign(
    {
      id: String(user.id || user._id),
      email: user.email,
      type: "access",
      jti: newTokenId(),
    },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TTL }
  );
}

function signTempToken(user) {
  return jwt.sign(
    {
      id: String(user.id || user._id),
      email: user.email,
      type: "2fa-pending",
      jti: newTokenId(),
    },
    process.env.JWT_SECRET,
    { expiresIn: TEMP_TTL }
  );
}

function verifyToken(token, expectedType) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (expectedType && decoded.type !== expectedType) {
    const err = new Error("Invalid token type");
    err.status = 401;
    throw err;
  }

  return decoded;
}

module.exports = {
  signAccessToken,
  signTempToken,
  verifyToken,
  ACCESS_TTL,
  TEMP_TTL,
};
