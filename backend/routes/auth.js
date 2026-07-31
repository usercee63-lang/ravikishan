const express = require("express");

const router = express.Router();

const {
  register,
  login,
  getMe,
  logout,
} = require("../controllers/authController");
const ensureDbConnection = require("../middleware/connectDb");

router.post("/register", ensureDbConnection, register);

router.post("/login", ensureDbConnection, login);

router.get("/me", getMe);

router.post("/logout", logout);

module.exports = router;
