const logger = require("../utils/logger");

function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;

  if (status >= 500) {
    logger.error(`${req.method} ${req.originalUrl}`, {
      status,
      message: err.message,
      stack: err.stack,
    });
  } else {
    logger.warn(`${req.method} ${req.originalUrl}`, {
      status,
      message: err.message,
    });
  }

  if (res.headersSent) {
    return next(err);
  }

  return res.status(status).json({
    success: false,
    message:
      status >= 500
        ? "Internal server error"
        : err.message || "Request failed",
  });
}

module.exports = {
  notFound,
  errorHandler,
};
