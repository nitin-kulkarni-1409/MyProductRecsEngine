const products = require("../data/products.json");

/**
 * Generates product recommendations for a user based on their history.
 *
 * This function filters out products that the user has already seen 
 * and returns a limited number of new product recommendations.
 *
 * @param {Object} params - The parameters for generating recommendations.
 * @param {Object} params.user - The user object containing user data.
 * @param {Array} params.user.history - An array of product IDs that the user has seen.
 * @param {number} params.limit - The maximum number of recommendations to return.
 * @returns {Array} An array of recommended products that the user has not seen.
 */
function behavioralRecs({ user, limit }) {
  const seenProducts = new Set(user.history);

  return products
    .filter(p => !seenProducts.has(p.id))
    .slice(0, limit);
}

module.exports = behavioralRecs;
