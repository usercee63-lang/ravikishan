const mongoose = require("mongoose");

const studyMaterialSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    chapter: {
      type: String,
      required: true,
      trim: true,
    },

    topic: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      trim: true,
      index: true,
    },

    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

studyMaterialSchema.index(
  { subject: 1, chapter: 1, topic: 1 },
  { unique: true }
);

module.exports = mongoose.model("StudyMaterial", studyMaterialSchema);
