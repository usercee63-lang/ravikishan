const { verifyToken } = require("../utils/jwt");

const COOKIE_NAME = "token";

function getTokenFromRequest(req) {
  if (req.cookies && req.cookies[COOKIE_NAME]) {
    return req.cookies[COOKIE_NAME];
  }

  const authHeader = req.headers.authorization;

  if (authHeader) {
    return authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;
  }

  return null;
}

function loadUser(req, res, next) {
  if (req.session && req.session.user) {
    req.user = req.session.user;
    return next();
  }

  const token = getTokenFromRequest(req);

  if (!token) {
    return next();
  }

  try {
    const decoded = verifyToken(token, "access");

    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    return next();
  } catch {
    return next();
  }
}

function requireAuth(req, res, next) {
  if (req.user) {
    return next();
  }

  return res.status(401).json({
    success: false,
    message: "Not logged in",
  });
}

module.exports = {
  loadUser,
  requireAuth,
  getTokenFromRequest,
  COOKIE_NAME,
};
