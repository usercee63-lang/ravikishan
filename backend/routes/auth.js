const express = require("express");

const router = express.Router();

const {
  register,
  login,
  loginWithTwoFactor,
  getMe,
  refresh,
  logout,
  setupTwoFactor,
  verifyTwoFactor,
  disableTwoFactor,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const ensureDbConnection = require("../middleware/connectDb");
const { loadUser, requireAuth, getTokenFromRequest } = require("../middleware/auth");
const {
  loginLimiter,
  registerLimiter,
  twoFactorLimiter,
  forgotPasswordLimiter,
  resetPasswordLimiter,
} = require("../middleware/rateLimit");

router.post(
  "/register",
  registerLimiter,
  ensureDbConnection,
  register
);

router.post("/login", loginLimiter, ensureDbConnection, login);

router.post(
  "/2fa/login",
  twoFactorLimiter,
  ensureDbConnection,
  loginWithTwoFactor
);

router.post("/2fa/setup", loadUser, requireAuth, setupTwoFactor);

router.post("/2fa/verify", loadUser, requireAuth, verifyTwoFactor);

router.post("/2fa/disable", loadUser, requireAuth, disableTwoFactor);

router.get("/me", loadUser, getMe);

router.post("/refresh", (req, res, next) => {
  req.token = getTokenFromRequest(req);
  next();
}, refresh);

router.post("/logout", logout);

router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  ensureDbConnection,
  forgotPassword
);

router.post(
  "/reset-password",
  resetPasswordLimiter,
  ensureDbConnection,
  resetPassword
);

module.exports = router;
