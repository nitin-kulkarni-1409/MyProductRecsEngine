const products = require("../data/products.json");

/**
 * Returns products in the same categories as the user's history or a seed product,
 * excluding products the user has already seen.
 *
 * @param {Object} params - The parameters for generating recommendations.
 * @param {Object} params.user - The user object containing user data.
 * @param {Array} params.user.history - An array of product IDs that the user has seen.
 * @param {number} params.limit - The maximum number of recommendations to return.
 * @param {string} [params.category] - Optional category to constrain similar results.
 * @param {number} [params.productId] - Optional seed product ID for similar results.
 * @returns {Array} An array of similar-category products the user has not seen.
 */
function similarProducts({ user, limit, category, productId }) {
  if (!user) {
    return [];
  }

  const seenProducts = new Set(user.history || []);
  const categoryFilter = category && category !== "general" ? category : null;

  if (categoryFilter) {
    return products
      .filter(p => p.category === categoryFilter && !seenProducts.has(p.id))
      .slice(0, limit);
  }

  let seedCategories = new Set();

  if (productId) {
    const seedProduct = products.find(p => p.id === productId);
    if (seedProduct) {
      seedCategories.add(seedProduct.category);
    }
  }

  if (seedCategories.size === 0) {
    seedCategories = new Set(
      products
        .filter(p => seenProducts.has(p.id))
        .map(p => p.category)
    );
  }

  if (seedCategories.size === 0) {
    return [];
  }

  return products
    .filter(p => seedCategories.has(p.category) && !seenProducts.has(p.id))
    .slice(0, limit);
}

module.exports = similarProducts;
