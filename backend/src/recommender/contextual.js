/**
 * Generates contextual product recommendations based on category and gender filters.
 * 
 * @function contextualRecs
 * @param {Object} options - The options object for filtering recommendations
 * @param {string} options.category - The product category/brand to filter by. Use "general" to include all brands
 * @param {string} options.gender - The target gender demographic. Use "any" to include all genders
 * @param {number} options.limit - The maximum number of products to return
 * @returns {Array<Object>} An array of product objects matching the specified filters, limited by the limit parameter
 * 
 * @example
 * const recs = contextualRecs({ category: "nike", gender: "mens", limit: 10 });
 * 
 * @description
 * Filters the products dataset by:
 * 1. category - matches the specified brand/category or includes all if "general" is passed
 * 2. Gender - matches the specified gender or includes all if "any" is passed
 * 3. Limit - slices the results to return only the first N products
 */
const products = require("../data/products.json");

function contextualRecs({ category, gender, limit }) {
    console.log("➡️ contextualRecs() called with category:", category, "gender:", gender, "limit:", limit);
    console.log("📦 Total products available:", products.length);
  return products
    .filter(p =>
      (category === "general" || p.brand === category) &&
      (gender === "any" || p.gender === gender)
    )
    .slice(0, limit);
}

module.exports = contextualRecs;
