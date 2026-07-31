const mongoose = require("mongoose");
const dns = require("dns");

const logger = require("../utils/logger");

const CONNECT_TIMEOUT_MS = 5000;

dns.setServers(["8.8.8.8", "1.1.1.1"]);

mongoose.connection.on("error", (err) => {
  logger.error("MongoDB connection error", {
    message: err.message,
    stack: err.stack,
  });
});

mongoose.connection.on("disconnected", () => {
  logger.warn("MongoDB disconnected");
});

async function waitForConnection(timeoutMs = CONNECT_TIMEOUT_MS) {
  const start = Date.now();

  while (mongoose.connection.readyState !== 1) {
    if (Date.now() - start > timeoutMs) {
      throw new Error("MongoDB connection not established");
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: CONNECT_TIMEOUT_MS,
    });

    await waitForConnection(CONNECT_TIMEOUT_MS);

    logger.info("MongoDB Connected");
  } catch (err) {
    logger.error("MongoDB Connection Failed", {
      message: err.message,
      stack: err.stack,
    });
    throw err;
  }
}

module.exports = connectDB;
