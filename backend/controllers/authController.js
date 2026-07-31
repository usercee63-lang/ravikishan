const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { hashPassword, verifyPassword } = require("../utils/password");

function toPublicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
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

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
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
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    req.session.user = toPublicUser(user);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
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

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !verifyPassword(password, user.password)) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    req.session.regenerate((regenerateErr) => {
      if (regenerateErr) {
        return next(regenerateErr);
      }

      req.session.user = toPublicUser(user);

      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

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
  if (!req.session.user) {
    return res.status(401).json({
      success: false,
      message: "Not logged in",
    });
  }

  return res.json({
    success: true,
    user: req.session.user,
  });
}

function logout(req, res, next) {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }

    return res.clearCookie("connect.sid").json({
      success: true,
      message: "Logged out successfully",
    });
  });
}

module.exports = {
  register,
  login,
  getMe,
  logout,
};
