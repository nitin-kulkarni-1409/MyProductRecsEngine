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

function recommend({ userId, channel, limit, gender }) {
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
      data: contextualRecs({ channel, gender, limit })
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
    data: contextualRecs({ channel, gender, limit })
  };
}

module.exports = recommend;
