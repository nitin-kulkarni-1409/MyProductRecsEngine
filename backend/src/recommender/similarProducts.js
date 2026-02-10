const products = require("../data/products.json");

/**
 * Returns products in the same categories as the user's history,
 * excluding products the user has already seen.
 *
 * @param {Object} params - The parameters for generating recommendations.
 * @param {Object} params.user - The user object containing user data.
 * @param {Array} params.user.history - An array of product IDs that the user has seen.
 * @param {number} params.limit - The maximum number of recommendations to return.
 * @param {string} [params.category] - Optional category to constrain similar results.
 * @returns {Array} An array of similar-category products the user has not seen.
 */
function similarProducts({ user, limit, category }) {
  const seenProducts = new Set(user.history || []);
  console.log("🔍 User history (seen product IDs):", seenProducts);
  
  if (seenProducts.size === 0) {
    return [];
  }

  const categories = new Set(
    products
      .filter(p => seenProducts.has(p.id))
      .map(p => p.category)
  );
  const categoryFilter = category && category !== "general" ? category : null;
  console.log("📂 Categories from user history:", categoryFilter);
  return products
    .filter(p =>
      categories.has(p.category) &&
      !seenProducts.has(p.id) &&
      (!categoryFilter || p.category === categoryFilter)
    )
    .slice(0, limit);
}

module.exports = similarProducts;
