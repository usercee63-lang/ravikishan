const { DataTypes, Model } = require("sequelize");

const { sequelize } = require("../config/db");

class StudyMaterial extends Model {}

StudyMaterial.init(
  {
    subject: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    chapter: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    topic: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    data: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
  },
  {
    sequelize,
    modelName: "StudyMaterial",
    tableName: "StudyMaterials",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["subject", "chapter", "topic"],
      },
      {
        fields: ["title"],
      },
    ],
  }
);

module.exports = StudyMaterial;
