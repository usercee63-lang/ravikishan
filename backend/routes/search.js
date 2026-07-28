const express = require("express");
const router = express.Router();

const { search } = require("../services/searchService");

router.get("/", (req, res) => {
  try {
    const { subject, q } = req.query;

    const results = search(subject, q || "");

    res.json(results);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

module.exports = router;
