const { DataTypes, Model } = require("sequelize");

const { sequelize } = require("../config/db");

class AccessPolicy extends Model {
  static async getOrCreate() {
    let policy = await this.findOne();

    if (!policy) {
      policy = await this.create({ id: 1, approvedEmails: [] });
    }

    return policy;
  }
}

AccessPolicy.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      defaultValue: 1,
    },

    approvedEmails: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    sequelize,
    modelName: "AccessPolicy",
    tableName: "AccessPolicies",
    timestamps: true,
  }
);

module.exports = AccessPolicy;
