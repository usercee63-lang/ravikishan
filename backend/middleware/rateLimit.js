const rateLimit = require("express-rate-limit");

function makeLimiter({ windowMs, max, message }) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message,
      });
    },
  });
}

const loginLimiter = makeLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many login attempts, please try again later",
});

const registerLimiter = makeLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: "Too many registration attempts, please try again later",
});

const twoFactorLimiter = makeLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many 2FA attempts, please try again later",
});

const forgotPasswordLimiter = makeLimiter({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: "Too many password reset requests, please try again later",
});

const resetPasswordLimiter = makeLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: "Too many reset attempts, please try again later",
});

const aiLimiter = makeLimiter({
  windowMs: 60 * 60 * 1000,
  max: 40,
  message: "AI tutor usage limit reached, please try again later",
});

const globalLimiter = makeLimiter({
  windowMs: 15 * 60 * 1000,
  max: 600,
  message: "Too many requests, please slow down",
});

module.exports = {
  loginLimiter,
  registerLimiter,
  twoFactorLimiter,
  forgotPasswordLimiter,
  resetPasswordLimiter,
  aiLimiter,
  globalLimiter,
};
