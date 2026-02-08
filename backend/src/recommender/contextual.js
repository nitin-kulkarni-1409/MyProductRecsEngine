/**
 * Generates contextual product recommendations based on channel and gender filters.
 * 
 * @function contextualRecs
 * @param {Object} options - The options object for filtering recommendations
 * @param {string} options.channel - The product channel/brand to filter by. Use "general" to include all brands
 * @param {string} options.gender - The target gender demographic. Use "any" to include all genders
 * @param {number} options.limit - The maximum number of products to return
 * @returns {Array<Object>} An array of product objects matching the specified filters, limited by the limit parameter
 * 
 * @example
 * const recs = contextualRecs({ channel: "nike", gender: "mens", limit: 10 });
 * 
 * @description
 * Filters the products dataset by:
 * 1. Channel - matches the specified brand/channel or includes all if "general" is passed
 * 2. Gender - matches the specified gender or includes all if "any" is passed
 * 3. Limit - slices the results to return only the first N products
 */
const products = require("../data/products.json");

function contextualRecs({ channel, gender, limit }) {
    console.log("➡️ contextualRecs() called with channel:", channel, "gender:", gender, "limit:", limit);
    console.log("📦 Total products available:", products.length);
  return products
    .filter(p =>
      (channel === "general" || p.brand === channel) &&
      (gender === "any" || p.gender === gender)
    )
    .slice(0, limit);
}

module.exports = contextualRecs;
