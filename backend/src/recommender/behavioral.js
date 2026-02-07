const products = require("../data/products.json");

function behavioralRecs({ user, limit }) {
  const seenProducts = new Set(user.history);

  return products
    .filter(p => !seenProducts.has(p.id))
    .slice(0, limit);
}

module.exports = behavioralRecs;
