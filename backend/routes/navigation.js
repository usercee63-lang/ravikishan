const express = require("express");
const router = express.Router();

const { getNavigation } = require("../services/navigationService");
const { loadUser } = require("../middleware/auth");
const { requireAccess } = require("../middleware/access");

router.get("/:subject", loadUser, requireAccess, async (req, res) => {
  try {
    const data = await getNavigation(req.params.subject);

    res.json(data);
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
