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
 * 
 * @returns {Object} A recommendation object containing:
 *   @returns {string} type - The type of recommendation: "personalized" or "contextual"
 *   @returns {string} reason - The reason for this recommendation type (NEW_USER_CREATED, KNOWN_USER_WITH_HISTORY, KNOWN_USER_NO_HISTORY)
 *   @returns {Array} data - The array of recommended products
 */
const fs = require("fs");
const path = require("path");

const contextualRecs = require("./contextual");
const behavioralRecs = require("./behavioral");

const usersFile = path.join(__dirname, "../data/users.json");


function loadUsers() {
  return JSON.parse(fs.readFileSync(usersFile, "utf-8"));
}

function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

function recommend({ userId, category, limit, gender }) {
  console.log("➡️ recommend() called with userId:", userId);
  
  let users = loadUsers();
  console.log("👥 Loaded users:", users.map(u => u.id));

  let user = users.find(u => u.id === userId);

  console.log("🔍 Matched user:", user);

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
      data: contextualRecs({ category, gender, limit })
    };
  }

  // CASE 1: Known user with history
  if (user.history.length > 0) {
    return {
      type: "personalized",
      reason: "KNOWN_USER_WITH_HISTORY",
      data: behavioralRecs({ user, limit })
    };
  }

  // CASE 2: Known user, no history
  return {
    type: "contextual",
    reason: "KNOWN_USER_NO_HISTORY",
    data: contextualRecs({ category, gender, limit })
  };
}

module.exports = recommend;
