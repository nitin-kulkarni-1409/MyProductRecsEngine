/**
 * Recommends products to a user based on their history and profile information.
 *
 * Strategy Routing:
 * - CASE 1: Known user with history → Behavioral (gender + category affinity)
 * - CASE 2: Known user without history → Contextual
 * - CASE 3: New user → Create profile → Contextual
 * - Optional: Forced type = contextual | similar | brand
 */

const fs = require("fs");
const path = require("path");

const contextualRecs = require("./contextual");
const behavioralRecs = require("./behavioral");
const similarProducts = require("./similarProducts");
const moreFromBrand = require("./moreFromTheBrand");

const usersFile = path.join(__dirname, "../data/users.json");

function loadUsers() {
  return JSON.parse(fs.readFileSync(usersFile, "utf-8"));
}

function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

function recommend({
  userId,
  category,
  limit = 5,
  gender,
  type,
  productId,
  placement = "any"
}) {
  console.log("➡️ recommend() called with:", {
    userId,
    category,
    limit,
    gender,
    type,
    productId
  });

  let users = loadUsers();
  let user = users.find(u => u.id === userId);

  /* ---------------------------------------------------
     FORCED STRATEGIES (DO NOT DEPEND ON USER HISTORY)
  --------------------------------------------------- */

  if (type === "brand") {
    if (!productId) {
      return { error: "productId required for brand strategy" };
    }

    return {
      type: "brand",
      reason: "FORCED_BRAND",
      data: moreFromBrand({ productId, limit, placement })
    };
  }

  if (type === "similar") {
    return {
      type: "similar",
      reason: "FORCED_SIMILAR",
      data: similarProducts({ user, productId, limit, category })
    };
  }

  /* ---------------------------------------------------
     CASE 3: Unknown User → Create → Contextual
  --------------------------------------------------- */

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
      data: contextualRecs({
        category,
        gender,
        limit,
        seenProductIds: []
      })
    };
  }

  // Ensure history always exists
  if (!Array.isArray(user.history)) {
    user.history = [];
  }

  /* ---------------------------------------------------
     CASE 1: Known User WITH History → Behavioral
  --------------------------------------------------- */

  if (type !== "contextual" && user.history.length > 0) {
    return {
      type: "personalized",
      reason: "KNOWN_USER_WITH_HISTORY",
      data: behavioralRecs({
        user,
        limit,
        placement
      })
    };
  }

  /* ---------------------------------------------------
     CASE 2: Known User WITHOUT History → Contextual
  --------------------------------------------------- */

  return {
    type: "contextual",
    reason:
      type === "contextual"
        ? "FORCED_CONTEXTUAL"
        : "KNOWN_USER_NO_HISTORY",
    data: contextualRecs({
      category,
      gender: user.gender || gender,
      limit,
      seenProductIds: user.history
    })
  };
}

module.exports = recommend;
