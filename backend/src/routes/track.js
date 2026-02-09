/**
 * Track user interactions with products
 * 
 * POST /api/track
 * 
 * Handles click tracking events for products by recording user interactions
 * in a persistent JSON file. Prevents duplicate entries in user history.
 * 
 * @route POST /
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string|number} req.body.userId - The ID of the user performing the action
 * @param {string|number} req.body.productId - The ID of the product being interacted with
 * @param {string} req.body.event - The type of event (must be 'click')
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with status, message, userId, and productId
 * @throws {400} If userId, productId, or event are missing/invalid
 * @throws {404} If user not found in the system
 * 
 * @example
 * POST /api/track
 * {
 *   "userId": 1,
 *   "productId": 5,
 *   "event": "click"
 * }
 * 
 * Response: 
 * {
 *   "status": "OK",
 *   "message": "Click tracked",
 *   "userId": "1",
 *   "productId": "5"
 * }
 */
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");


const usersFile = path.join(__dirname, "../data/users.json");

function loadUsers() {
  return JSON.parse(fs.readFileSync(usersFile, "utf-8"));
}

function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

router.post("/", (req, res) => {
  console.log("🔥 /api/track HIT");
  console.log("📦 Body:", req.body);
  const { userId, productId, event } = req.body;

  if (!userId || !productId || event !== "click") {
    return res.status(400).json({
      error: "userId, productId and event='click' are required"
    });
  }

  const users = loadUsers();
  const user = users.find(u => u.id === Number(userId));

  if (!user) {
    return res.status(404).json({
      error: "User not found"
    });
  }

  // Avoid duplicates
  if (!user.history.includes(Number(productId))) {
    user.history.push(Number(productId));
    saveUsers(users);
  }

  res.json({
    status: "OK",
    message: "Click tracked",
    userId,
    productId
  });
});

module.exports = router;
