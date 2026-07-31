const { Sequelize } = require("sequelize");

const logger = require("../utils/logger");

const CONNECT_TIMEOUT_MS = Number(process.env.PG_CONNECT_TIMEOUT_MS) || 8000;
const MAX_RETRIES = Number(process.env.PG_MAX_RETRIES) || 5;
const RETRY_BASE_DELAY_MS = Number(process.env.PG_RETRY_DELAY_MS) || 1000;
const USE_SSL = process.env.PG_SSL !== "false";

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: USE_SSL
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {},
  pool: { max: 5, min: 0, idle: 10000, acquire: 30000 },
});

let dbUp = false;
let connecting = null;

function isDbUp() {
  return dbUp;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function syncModels() {
  require("../models/User");
  require("../models/StudyMaterial");
  require("../models/Subject");
  require("../models/AccessPolicy");
  require("../models/AccessRequest");

  await sequelize.sync();
}

async function connectWithRetry(attempt = 1) {
  try {
    await Promise.race([
      sequelize.authenticate(),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("PostgreSQL connection timed out")),
          CONNECT_TIMEOUT_MS
        )
      ),
    ]);

    await syncModels();

    dbUp = true;

    logger.info("PostgreSQL connected");

    return sequelize;
  } catch (err) {
    dbUp = false;

    if (attempt >= MAX_RETRIES) {
      logger.error("PostgreSQL connection failed after retries", {
        message: err.message,
        attempts: attempt,
      });
      throw err;
    }

    const delay = RETRY_BASE_DELAY_MS * 2 ** (attempt - 1);

    logger.warn(
      `PostgreSQL connection attempt ${attempt} failed, retrying in ${delay}ms`,
      { message: err.message }
    );

    await sleep(delay);

    return connectWithRetry(attempt + 1);
  }
}

async function connectDB() {
  if (dbUp) {
    return sequelize;
  }

  if (connecting) {
    return connecting;
  }

  connecting = connectWithRetry().finally(() => {
    connecting = null;
  });

  return connecting;
}

async function closeDB() {
  await sequelize.close();
  dbUp = false;
}

module.exports = {
  sequelize,
  connectDB,
  closeDB,
  isDbUp,
};
