const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, trim: true },
    title: { type: String, trim: true },
    important: { type: Boolean, default: false },
  },
  { _id: false }
);

const chapterSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, trim: true },
    title: { type: String, trim: true },
    description: { type: String, default: "" },
    topics: { type: [topicSchema], default: [] },
  },
  { _id: false }
);

const subjectSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    chapters: {
      type: [chapterSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Subject", subjectSchema);
