/**
 * Recommends products to a user based on their history and profile information.
 * 
 * This function implements a three-tier recommendation strategy:
 * - CASE 1: For known users with purchase history, returns personalized behavioral recommendations
 * - CASE 2: For known users without history, returns contextual recommendations based on demographics
 * - CASE 3: For new users, creates a user profile and returns contextual recommendations
 * 
 * The function loads user data from a JSON file, checks if the user exists, and routes them
 * to the appropriate recommendation engine (behavioral or contextual).
 * 
 * @param {Object} options - The recommendation options object
 * @param {string} options.userId - The unique identifier for the user
 * @param {string} options.category - The category or category context for recommendations
 * @param {number} options.limit - The maximum number of recommendations to return
 * @param {string} options.gender - The gender demographic of the user (used for contextual recommendations)
 * @param {string} [options.type] - Force recommendation type (e.g., "contextual", "similar")
 * 
 * @returns {Object} A recommendation object containing:
 *   @returns {string} type - The type of recommendation: "personalized", "contextual", or "similar"
 *   @returns {string} reason - The reason for this recommendation type (NEW_USER_CREATED, KNOWN_USER_WITH_HISTORY, KNOWN_USER_NO_HISTORY, FORCED_CONTEXTUAL, FORCED_SIMILAR)
 *   @returns {Array} data - The array of recommended products
 */
const fs = require("fs");
const path = require("path");

const contextualRecs = require("./contextual");
const behavioralRecs = require("./behavioral");
const similarProducts = require("./similarProducts");

const usersFile = path.join(__dirname, "../data/users.json");


function loadUsers() {
  return JSON.parse(fs.readFileSync(usersFile, "utf-8"));
}

function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

function recommend({ userId, category, limit, gender, type }) {
  console.log("➡️ recommend() called with userId:", userId);
  
  let users = loadUsers();
  console.log("👥 Loaded users:", users.map(u => u.id));

  let user = users.find(u => u.id === userId);

  console.log("🔍 Matched user:", user);
  console.log("User passed category filter:", category);
  console.log("User passed gender filter:", gender);
  console.log("User passed type filter:", type);  
  // CASE 3: Unknown user
  if (!user) {
    user = {
      id: userId,
      gender,
      history: []
    };
    users.push(user);
    saveUsers(users);

    return {
      type: "contextual",
      reason: "NEW_USER_CREATED",
      data: contextualRecs({ category, gender, limit, seenProductIds: user.history })
    };
  }

  // CASE 1: Known user with history (unless explicitly forced to contextual/similar)
  if (type !== "contextual" && type !== "similar" && user.history.length > 0) {
    return {
      type: "personalized",
      reason: "KNOWN_USER_WITH_HISTORY",
      data: behavioralRecs({ user, limit })
    };
  }

  // CASE 2: Known user, forced similar
  if (type === "similar") {
    return {
      type: "similar",
      reason: "FORCED_SIMILAR",
      data: similarProducts({ user, limit, category })
    };
  }

  // CASE 3: Known user, no history (or forced contextual)
  return {
    type: "contextual",
    reason: type === "contextual" ? "FORCED_CONTEXTUAL" : "KNOWN_USER_NO_HISTORY",
    data: contextualRecs({ category, gender, limit, seenProductIds: user.history })
  };
}

module.exports = recommend;
