/**
 * Recommendations Router Module
 * 
 * Provides API endpoints for retrieving personalized product recommendations
 * based on user preferences and filtering criteria.
 * 
 * @module routes/recommendations
 * @requires express
 * @requires ../recommender
 */

/**
 * GET / - Retrieve product recommendations for a user
 * 
 * Query Parameters:
 * @param {number} userId - (Required) The unique identifier of the user
 * @param {string} [channel="general"] - The product channel/category (e.g., "general", "fashion", "electronics")
 * @param {number} [limit=5] - Maximum number of recommendations to return
 * @param {string} [gender="women"] - Target gender demographic for recommendations (e.g., "women", "men", "unisex")
 * @param {string} [placement="any"] - Placement type for filtering recommendations (e.g., "any", "featured", "trending")
 * 
 * @returns {Object} JSON response containing recommended products
 * @returns {string} error - Error message if userId is missing (HTTP 400)
 * 
 * @example
 * GET /recommendations?userId=123&channel=fashion&limit=10&gender=women&placement=featured
 */
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
