const products = require("../data/products.json");
const events = require("../data/events.json");

function getPersonalizedRecommendations({
  userId,
  category = "general",
  limit = 5,
  gender = "women",
  placement = "any"
}) {
  const userEvents = events.filter(e => e.userId === userId);

  let candidateProducts = products;

  // 🎯 Filter by brand/category
  if (category !== "general") {
    candidateProducts = candidateProducts.filter(
      p => p.brand === category
    );
  }

  // 🎯 Filter by gender
  if (gender) {
    candidateProducts = candidateProducts.filter(
      p => p.gender === gender
    );
  }

  // 🎯 Filter by placement
  if (placement !== "any") {
    candidateProducts = candidateProducts.filter(
      p => p.placements.includes(placement)
    );
  }

  // 🎯 If user has history, prioritize similar categories
  if (userEvents.length > 0) {
    const interactedProductIds = userEvents.map(e => e.productId);
    const categories = products
      .filter(p => interactedProductIds.includes(p.id))
      .map(p => p.category);

    candidateProducts = candidateProducts.filter(
      p => categories.includes(p.category)
    );
  }

  return candidateProducts.slice(0, limit);
}

module.exports = { getPersonalizedRecommendations };
