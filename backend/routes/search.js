const express = require("express");
const router = express.Router();

const { search } = require("../services/searchService");
const { loadUser } = require("../middleware/auth");
const { requireAccess } = require("../middleware/access");

router.get("/", loadUser, requireAccess, async (req, res) => {
  try {
    const { subject, q } = req.query;

    const results = await search(subject, q || "");

    res.json(results);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

module.exports = router;
