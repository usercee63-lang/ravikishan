const speakeasy = require("speakeasy");

const TWO_FACTOR_APP_NAME = "Ravikishan Study Vault";

function generateTwoFactorSecret(email) {
  const secret = speakeasy.generateSecret({
    name: `${TWO_FACTOR_APP_NAME}:${email}`,
    issuer: TWO_FACTOR_APP_NAME,
  });

  return {
    base32: secret.base32,
    otpauthUrl: secret.otpauth_url,
  };
}

function verifyTwoFactorCode(secretBase32, code) {
  if (!secretBase32 || !code) return false;

  return speakeasy.totp.verify({
    secret: secretBase32,
    encoding: "base32",
    token: String(code).trim(),
    window: 1,
  });
}

module.exports = {
  generateTwoFactorSecret,
  verifyTwoFactorCode,
};
