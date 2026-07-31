const crypto = require("crypto");

const SCRYPT_KEY_LENGTH = 64;
const SALT_BYTES = 16;
const PREFIX = "scrypt";

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

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

function validatePassword(password) {
  if (typeof password !== "string") {
    return "Password must be a string";
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`;
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    return `Password must be at most ${MAX_PASSWORD_LENGTH} characters long`;
  }

  return null;
}

module.exports = {
  hashPassword,
  verifyPassword,
  validatePassword,
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
};
