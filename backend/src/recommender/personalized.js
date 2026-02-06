const products = require("../data/products.json");
const events = require("../data/events.json");

function getPersonalizedRecommendations(userId, limit = 5) {
  const userEvents = events.filter(e => e.userId === userId);

  if (userEvents.length === 0) return [];

  const productIds = userEvents.map(e => e.productId);

  const categories = products
    .filter(p => productIds.includes(p.id))
    .map(p => p.category);

  return products
    .filter(p => categories.includes(p.category))
    .slice(0, limit);
}

module.exports = { getPersonalizedRecommendations };
