const { connectDB, isDbUp } = require("../config/db");

const COOLDOWN_MS = 30000;
const MAX_FAILURES = 3;

let failureTimes = [];

function isThrottled() {
  const now = Date.now();

  failureTimes = failureTimes.filter((t) => now - t < 60000);

  return failureTimes.length >= MAX_FAILURES;
}

async function ensureDbConnection(req, res, next) {
  if (isDbUp()) {
    return next();
  }

  if (isThrottled()) {
    return res.status(503).json({
      success: false,
      message: "Database unavailable, please try again later",
    });
  }

  try {
    await connectDB();
    next();
  } catch {
    failureTimes.push(Date.now());

    return res.status(503).json({
      success: false,
      message: "Database unavailable, please try again later",
      retryAfter: Math.ceil(COOLDOWN_MS / 1000),
    });
  }
}

module.exports = ensureDbConnection;
