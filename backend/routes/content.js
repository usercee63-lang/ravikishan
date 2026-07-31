const express = require("express");
const router = express.Router();

const { getContent } = require("../services/contentService");
const { loadUser } = require("../middleware/auth");
const { requireAccess } = require("../middleware/access");

router.get(
  "/:subject/:chapter/:topic",
  loadUser,
  requireAccess,
  async (req, res) => {
    try {
      const data = await getContent(
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
        mindmap: null,
      });
    }
  }
);

module.exports = router;
