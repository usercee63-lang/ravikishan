const mongoose = require("mongoose");
const dns = require("dns");

const logger = require("../utils/logger");

const CONNECT_TIMEOUT_MS = Number(process.env.MONGO_CONNECT_TIMEOUT_MS) || 8000;
const MAX_RETRIES = Number(process.env.MONGO_MAX_RETRIES) || 5;
const RETRY_BASE_DELAY_MS = Number(process.env.MONGO_RETRY_DELAY_MS) || 1000;

dns.setServers(["8.8.8.8", "1.1.1.1"]);

let connecting = null;

mongoose.connection.on("connected", () => {
  logger.info("MongoDB connected");
});

mongoose.connection.on("error", (err) => {
  logger.error("MongoDB connection error", {
    message: err.message,
    stack: err.stack,
  });
});

mongoose.connection.on("disconnected", () => {
  logger.warn("MongoDB disconnected");
});

mongoose.connection.on("reconnected", () => {
  logger.info("MongoDB reconnected");
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForConnection(timeoutMs = CONNECT_TIMEOUT_MS) {
  const start = Date.now();

  while (mongoose.connection.readyState !== 1) {
    if (Date.now() - start > timeoutMs) {
      throw new Error("MongoDB connection not established");
    }

    await sleep(100);
  }
}

async function connectWithRetry(attempt = 1) {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: CONNECT_TIMEOUT_MS,
      connectTimeoutMS: CONNECT_TIMEOUT_MS,
      socketTimeoutMS: 60000,
      maxPoolSize: 10,
      minPoolSize: 0,
      family: 4,
    });

    await waitForConnection(CONNECT_TIMEOUT_MS);

    return mongoose.connection;
  } catch (err) {
    if (attempt >= MAX_RETRIES) {
      logger.error("MongoDB connection failed after retries", {
        message: err.message,
        attempts: attempt,
      });
      throw err;
    }

    const delay = RETRY_BASE_DELAY_MS * 2 ** (attempt - 1);

    logger.warn(
      `MongoDB connection attempt ${attempt} failed, retrying in ${delay}ms`,
      { message: err.message }
    );

    await sleep(delay);

    return connectWithRetry(attempt + 1);
  }
}

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connecting) {
    return connecting;
  }

  connecting = connectWithRetry().finally(() => {
    connecting = null;
  });

  return connecting;
}

module.exports = connectDB;
