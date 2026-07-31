const { DataTypes, Model } = require("sequelize");

const { sequelize } = require("../config/db");

class Subject extends Model {}

Subject.init(
  {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    chapters: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    sequelize,
    modelName: "Subject",
    tableName: "Subjects",
    timestamps: true,
  }
);

module.exports = Subject;
