const mongoose = require("mongoose");

const { isAdminEmail, isApproved } = require("../services/accessService");

async function requireAccess(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return next();
  }

  if (!req.user) {
    return res.status(401).json({
      success: false,
      code: "LOGIN_REQUIRED",
      message: "Please log in to view this content",
    });
  }

  if (isAdminEmail(req.user.email)) {
    return next();
  }

  try {
    const approved = await isApproved(req.user.email);

    if (approved) {
      return next();
    }
  } catch (err) {
    return next(err);
  }

  return res.status(403).json({
    success: false,
    code: "ACCESS_PENDING",
    message:
      "Your account has not been approved yet. Please request access from your account page.",
  });
}

function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      code: "LOGIN_REQUIRED",
      message: "Please log in first",
    });
  }

  if (!isAdminEmail(req.user.email)) {
    return res.status(403).json({
      success: false,
      code: "ADMIN_REQUIRED",
      message: "You do not have permission to perform this action",
    });
  }

  return next();
}

module.exports = {
  requireAccess,
  requireAdmin,
};
