const mongoose = require("mongoose");

const connectDB = require("../config/db");

async function ensureDbConnection(req, res, next) {
  if (mongoose.connection.readyState === 1) {
    return next();
  }

  try {
    await connectDB();
    next();
  } catch {
    return res.status(503).json({
      success: false,
      message: "Database unavailable, please try again later",
    });
  }
}

module.exports = ensureDbConnection;
