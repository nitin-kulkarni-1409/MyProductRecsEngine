const events = require("../data/events.json");

function getPopularProducts(limit = 5) {
  const counts = {};

  events.forEach(e => {
    counts[e.productId] = (counts[e.productId] || 0) + 1;
  });

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([productId]) => Number(productId));
}

module.exports = { getPopularProducts };
