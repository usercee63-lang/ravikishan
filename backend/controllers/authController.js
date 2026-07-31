const crypto = require("crypto");
const QRCode = require("qrcode");

const User = require("../models/User");
const {
  hashPassword,
  verifyPassword,
  validatePassword,
} = require("../utils/password");
const {
  signAccessToken,
  signTempToken,
  verifyToken,
  ACCESS_TTL,
} = require("../utils/jwt");
const {
  generateTwoFactorSecret,
  verifyTwoFactorCode,
} = require("../utils/twoFactor");
const { COOKIE_NAME } = require("../middleware/auth");

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

function toPublicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    twoFactorEnabled: !!user.twoFactorEnabled,
  };
}

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  };
}

function setAuthCookies(res, token) {
  res.cookie(COOKIE_NAME, token, cookieOptions());
}

function clearAuthCookies(res) {
  res.clearCookie(COOKIE_NAME, cookieOptions());
  res.clearCookie("connect.sid", cookieOptions());
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const passwordError = validatePassword(password);

    if (passwordError) {
      return res.status(400).json({
        success: false,
        message: passwordError,
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = hashPassword(password);

    const user = await User.create({
      name: String(name).trim().slice(0, 100),
      email: normalizedEmail,
      password: hashedPassword,
    });

    req.session.user = toPublicUser(user);

    const token = signAccessToken(user);

    setAuthCookies(res, token);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: toPublicUser(user),
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: String(email).trim().toLowerCase(),
    }).select("+twoFactorSecret");

    if (!user || !verifyPassword(password, user.password)) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.twoFactorEnabled) {
      const tempToken = signTempToken(user);

      return res.json({
        success: true,
        message: "Two-factor authentication required",
        pending2fa: true,
        tempToken,
      });
    }

    req.session.regenerate((regenerateErr) => {
      if (regenerateErr) {
        return next(regenerateErr);
      }

      req.session.user = toPublicUser(user);

      const token = signAccessToken(user);

      setAuthCookies(res, token);

      return res.json({
        success: true,
        message: "Logged in successfully",
        token,
        user: toPublicUser(user),
      });
    });
  } catch (err) {
    next(err);
  }
}

async function loginWithTwoFactor(req, res, next) {
  try {
    const { code, tempToken } = req.body;

    if (!code || !tempToken) {
      return res.status(400).json({
        success: false,
        message: "Verification code and session token are required",
      });
    }

    let decoded;

    try {
      decoded = verifyToken(tempToken, "2fa-pending");
    } catch {
      return res.status(401).json({
        success: false,
        message: "Your login session has expired, please log in again",
      });
    }

    const user = await User.findById(decoded.id).select("+twoFactorSecret");

    if (!user || !user.twoFactorEnabled) {
      return res.status(401).json({
        success: false,
        message: "Two-factor authentication is not enabled for this account",
      });
    }

    if (!verifyTwoFactorCode(user.twoFactorSecret, code)) {
      return res.status(401).json({
        success: false,
        message: "Invalid verification code",
      });
    }

    req.session.regenerate((regenerateErr) => {
      if (regenerateErr) {
        return next(regenerateErr);
      }

      req.session.user = toPublicUser(user);

      const token = signAccessToken(user);

      setAuthCookies(res, token);

      return res.json({
        success: true,
        message: "Logged in successfully",
        token,
        user: toPublicUser(user),
      });
    });
  } catch (err) {
    next(err);
  }
}

function getMe(req, res) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not logged in",
    });
  }

  return res.json({
    success: true,
    user: req.user,
  });
}

function refresh(req, res) {
  const token = req.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not logged in",
    });
  }

  let decoded;

  try {
    decoded = verifyToken(token, "access");
  } catch {
    return res.status(401).json({
      success: false,
      message: "Session expired, please log in again",
    });
  }

  const rotated = signAccessToken(decoded);

  setAuthCookies(res, rotated);

  return res.json({
    success: true,
    message: "Token refreshed",
    token: rotated,
  });
}

function logout(req, res, next) {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }

    clearAuthCookies(res);

    return res.json({
      success: true,
      message: "Logged out successfully",
    });
  });
}

async function setupTwoFactor(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select("+twoFactorSecret");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.twoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message: "Two-factor authentication is already enabled",
      });
    }

    const { base32, otpauthUrl } = generateTwoFactorSecret(user.email);

    user.twoFactorSecret = base32;
    await user.save();

    const qrCode = await QRCode.toDataURL(otpauthUrl);

    return res.json({
      success: true,
      message: "Scan the QR code with your authenticator app",
      secret: base32,
      otpauthUrl,
      qrCode,
    });
  } catch (err) {
    next(err);
  }
}

async function verifyTwoFactor(req, res, next) {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Verification code is required",
      });
    }

    const user = await User.findById(req.user.id).select("+twoFactorSecret");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.twoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message: "Two-factor authentication is already enabled",
      });
    }

    if (!user.twoFactorSecret) {
      return res.status(400).json({
        success: false,
        message: "Two-factor setup has not been started",
      });
    }

    if (!verifyTwoFactorCode(user.twoFactorSecret, code)) {
      return res.status(401).json({
        success: false,
        message: "Invalid verification code",
      });
    }

    user.twoFactorEnabled = true;
    await user.save();

    if (req.session.user) {
      req.session.user = toPublicUser(user);
    }

    return res.json({
      success: true,
      message: "Two-factor authentication enabled",
      user: toPublicUser(user),
    });
  } catch (err) {
    next(err);
  }
}

async function disableTwoFactor(req, res, next) {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Verification code is required",
      });
    }

    const user = await User.findById(req.user.id).select("+twoFactorSecret");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!verifyTwoFactorCode(user.twoFactorSecret, code)) {
      return res.status(401).json({
        success: false,
        message: "Invalid verification code",
      });
    }

    user.twoFactorEnabled = false;
    user.twoFactorSecret = null;
    await user.save();

    if (req.session.user) {
      req.session.user = toPublicUser(user);
    }

    return res.json({
      success: true,
      message: "Two-factor authentication disabled",
      user: toPublicUser(user),
    });
  } catch (err) {
    next(err);
  }
}

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({
      email: String(email).trim().toLowerCase(),
    });

    if (!user) {
      return res.json({
        success: true,
        message:
          "If that email is registered, a reset link will be sent",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = hashToken(resetToken);
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    return res.json({
      success: true,
      message:
        "Password reset token generated. In production this would be emailed to you.",
      resetToken,
    });
  } catch (err) {
    next(err);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    const passwordError = validatePassword(newPassword);

    if (passwordError) {
      return res.status(400).json({
        success: false,
        message: passwordError,
      });
    }

    const user = await User.findOne({
      resetPasswordToken: hashToken(String(token)),
      resetPasswordExpires: { $gt: new Date() },
    }).select("+resetPasswordToken +resetPasswordExpires");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Reset token is invalid or has expired",
      });
    }

    user.password = hashPassword(newPassword);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.json({
      success: true,
      message: "Password reset successfully, please log in",
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
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
  ACCESS_TTL,
};
