const express = require("express");
const router = express.Router();
const { getPopularProducts } = require("../recommender/popular");
const { getPersonalizedRecommendations } = require("../recommender/personalized");

router.get("/", (req, res) => {
  const userId = Number(req.query.userId);

  if (!userId) {
    return res.json({ type: "popular", data: getPopularProducts() });
  }

  const personalized = getPersonalizedRecommendations(userId);

  if (personalized.length > 0) {
    return res.json({ type: "personalized", data: personalized });
  }

  res.json({ type: "popular", data: getPopularProducts() });
});

module.exports = router;
