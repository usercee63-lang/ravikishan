const mongoose = require("mongoose");

const accessPolicySchema = new mongoose.Schema(
  {
    approvedEmails: {
      type: [String],
      default: [],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

accessPolicySchema.statics.getOrCreate = async function () {
  let policy = await this.findOne().lean();

  if (!policy) {
    policy = await this.create({ approvedEmails: [] });
  }

  return policy;
};

module.exports = mongoose.model("AccessPolicy", accessPolicySchema);
