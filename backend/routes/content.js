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
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
