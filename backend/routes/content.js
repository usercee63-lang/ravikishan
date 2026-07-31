const express = require("express");
const router = express.Router();

const {
  getContent,
} = require("../services/contentService");

router.get("/:subject/:chapter/:topic", (req, res) => {
  try {
    const data = getContent(
      req.params.subject,
      req.params.chapter,
      req.params.topic
    );

    res.json(data);
  } catch {
    res.json({
      comingSoon: true,
      title: req.params.topic,
      notes: [],
      numericals: [],
      flashcards: [],
      quiz: [],
      video: [],
      mindmap: [],
    });
  }
});

module.exports = router;