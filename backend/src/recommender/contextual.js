const products = require("../data/products.json");

function contextualRecs({ channel, gender, limit }) {
  return products
    .filter(p =>
      (channel === "general" || p.brand === channel) &&
      (gender === "any" || p.gender === gender)
    )
    .slice(0, limit);
}

module.exports = contextualRecs;
