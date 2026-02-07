const express = require("express");
const router = express.Router();

// 👇 THIS is what was missing conceptually
const recommend = require("../recommender"); // index.js is auto-resolved

router.get("/", (req, res) => {
  const { userId, channel, limit, gender, placement } = req.query;

  // Basic safety check (route-level)
  if (!userId) {
    return res.status(400).json({
      error: "Missing required parameter: userId"
    });
  }

  const result = recommend({
    userId: Number(userId),
    channel: channel || "general",
    limit: limit ? Number(limit) : 5,
    gender: gender || "women",
    placement: placement || "any"
  });

  res.json(result);
});

module.exports = router;
