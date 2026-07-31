const AccessPolicy = require("../models/AccessPolicy");
const AccessRequest = require("../models/AccessRequest");

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function isAdminEmail(email) {
  const normalized = normalizeEmail(email);
  return normalized && ADMIN_EMAILS.includes(normalized);
}

async function isApproved(email) {
  const normalized = normalizeEmail(email);

  if (!normalized) {
    return false;
  }

  if (isAdminEmail(normalized)) {
    return true;
  }

  const policy = await AccessPolicy.getOrCreate();

  return policy.approvedEmails.includes(normalized);
}

async function getAccessStatus(email) {
  const normalized = normalizeEmail(email);

  if (!normalized) {
    return {
      loggedIn: false,
      approved: false,
      requestPending: false,
    };
  }

  const [approved, request] = await Promise.all([
    isApproved(normalized),
    AccessRequest.findOne({ where: { email: normalized }, raw: true }),
  ]);

  return {
    loggedIn: true,
    approved,
    isAdmin: isAdminEmail(normalized),
    requestPending: !!request && request.status === "pending",
    requestStatus: request ? request.status : null,
  };
}

async function requestAccess({ email, name }) {
  const normalized = normalizeEmail(email);

  if (!normalized) {
    throw new Error("A valid email is required");
  }

  if (await isApproved(normalized)) {
    return { alreadyApproved: true };
  }

  await AccessRequest.upsert({
    email: normalized,
    name: String(name || "").trim().slice(0, 100),
    status: "pending",
    requestedAt: new Date(),
  });

  return { alreadyApproved: false };
}

async function listRequests({ status } = {}) {
  const where = {};

  if (status && ["pending", "approved", "rejected"].includes(status)) {
    where.status = status;
  }

  return AccessRequest.findAll({
    where,
    order: [["requestedAt", "DESC"]],
    limit: 200,
    raw: true,
  });
}

async function approve(email) {
  const normalized = normalizeEmail(email);

  if (!normalized) {
    throw new Error("A valid email is required");
  }

  const [policy, existing] = await Promise.all([
    AccessPolicy.getOrCreate(),
    AccessRequest.findOne({ where: { email: normalized } }),
  ]);

  if (!policy.approvedEmails.includes(normalized)) {
    policy.approvedEmails = [...policy.approvedEmails, normalized];
    await policy.save();
  }

  await AccessRequest.upsert({
    email: normalized,
    name: existing ? existing.name : "",
    status: "approved",
    requestedAt: existing ? existing.requestedAt : new Date(),
  });

  return normalized;
}

async function reject(email) {
  const normalized = normalizeEmail(email);

  if (!normalized) {
    throw new Error("A valid email is required");
  }

  const existing = await AccessRequest.findOne({
    where: { email: normalized },
  });

  await AccessRequest.upsert({
    email: normalized,
    name: existing ? existing.name : "",
    status: "rejected",
    requestedAt: existing ? existing.requestedAt : new Date(),
  });

  return normalized;
}

async function revoke(email) {
  const normalized = normalizeEmail(email);

  if (!normalized) {
    throw new Error("A valid email is required");
  }

  const policy = await AccessPolicy.getOrCreate();

  if (policy.approvedEmails.includes(normalized)) {
    policy.approvedEmails = policy.approvedEmails.filter(
      (approved) => approved !== normalized
    );
    await policy.save();
  }

  return normalized;
}

module.exports = {
  isAdminEmail,
  isApproved,
  getAccessStatus,
  requestAccess,
  listRequests,
  approve,
  reject,
  revoke,
};
