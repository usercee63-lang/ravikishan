const { DataTypes, Model } = require("sequelize");

const { sequelize } = require("../config/db");

class AccessRequest extends Model {}

AccessRequest.init(
  {
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "",
    },

    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "pending",
      validate: {
        isIn: [["pending", "approved", "rejected"]],
      },
    },

    requestedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "AccessRequest",
    tableName: "AccessRequests",
    timestamps: true,
    indexes: [
      {
        fields: ["status"],
      },
      {
        fields: ["requestedAt"],
      },
    ],
  }
);

module.exports = AccessRequest;
