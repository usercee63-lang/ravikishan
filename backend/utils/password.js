const crypto = require("crypto");

const SCRYPT_KEY_LENGTH = 64;
const SALT_BYTES = 16;
const PREFIX = "scrypt";

function hashPassword(password) {
  const salt = crypto.randomBytes(SALT_BYTES).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, SCRYPT_KEY_LENGTH);

  return `${PREFIX}:${salt}:${derivedKey.toString("hex")}`;
}

function verifyPassword(password, stored) {
  const [prefix, salt, hash] = String(stored).split(":");

  if (prefix !== PREFIX || !salt || !hash) {
    return false;
  }

  const derivedKey = crypto.scryptSync(password, salt, SCRYPT_KEY_LENGTH);

  const storedBuffer = Buffer.from(hash, "hex");
  const derivedBuffer = Buffer.from(derivedKey);

  return (
    storedBuffer.length === derivedBuffer.length &&
    crypto.timingSafeEqual(storedBuffer, derivedBuffer)
  );
}

module.exports = {
  hashPassword,
  verifyPassword,
};
