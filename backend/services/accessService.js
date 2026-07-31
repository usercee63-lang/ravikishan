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
    AccessRequest.findOne({ email: normalized }).lean(),
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

  await AccessRequest.updateOne(
    { email: normalized },
    {
      $set: {
        name: String(name || "").trim().slice(0, 100),
        status: "pending",
        requestedAt: new Date(),
      },
    },
    { upsert: true }
  );

  return { alreadyApproved: false };
}

async function listRequests({ status } = {}) {
  const filter = {};

  if (status && ["pending", "approved", "rejected"].includes(status)) {
    filter.status = status;
  }

  return AccessRequest.find(filter)
    .sort({ requestedAt: -1 })
    .limit(200)
    .lean();
}

async function approve(email) {
  const normalized = normalizeEmail(email);

  if (!normalized) {
    throw new Error("A valid email is required");
  }

  const policy = await AccessPolicy.getOrCreate();

  if (!policy.approvedEmails.includes(normalized)) {
    await AccessPolicy.updateOne(
      { _id: policy._id },
      { $addToSet: { approvedEmails: normalized } }
    );
  }

  await AccessRequest.updateOne(
    { email: normalized },
    { $set: { status: "approved" } },
    { upsert: true }
  );

  return normalized;
}

async function reject(email) {
  const normalized = normalizeEmail(email);

  if (!normalized) {
    throw new Error("A valid email is required");
  }

  await AccessRequest.updateOne(
    { email: normalized },
    { $set: { status: "rejected" } },
    { upsert: true }
  );

  return normalized;
}

async function revoke(email) {
  const normalized = normalizeEmail(email);

  if (!normalized) {
    throw new Error("A valid email is required");
  }

  const policy = await AccessPolicy.getOrCreate();

  await AccessPolicy.updateOne(
    { _id: policy._id },
    { $pull: { approvedEmails: normalized } }
  );

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
