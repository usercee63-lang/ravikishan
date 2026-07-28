const express = require("express");
const router = express.Router();

const {
  getNavigation,
} = require("../services/navigationService");

router.get("/:subject", (req, res) => {
  try {
    const data = getNavigation(req.params.subject);

    res.json(data);
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
