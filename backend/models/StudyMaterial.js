const mongoose = require("mongoose");

const studyMaterialSchema = new mongoose.Schema({
  title: String,
  content: String,
});

module.exports = mongoose.model("StudyMaterial", studyMaterialSchema);
