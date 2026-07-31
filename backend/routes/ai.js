const express = require("express");

const router = express.Router();

const { chatWithTutor } = require("../services/aiService");

router.post("/tutor", async (req, res) => {
  const { title, notes, messages } = req.body || {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({
      success: false,
      message: "messages must be a non-empty array",
    });
  }

  try {
    const reply = await chatWithTutor({ title, notes, messages });

    return res.json({
      success: true,
      reply,
    });
  } catch (err) {
    const status = err.status || 502;

    return res.status(status).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
