const products = require("../data/products.json");

function moreFromBrand({ productId, limit = 4, placement = "any" }) {
  const currentProduct = products.find(p => p.id === productId);
  if (!currentProduct) return [];

  let results = products.filter(p =>
    p.brand === currentProduct.brand &&
    p.id !== currentProduct.id
  );

  if (placement !== "any") {
    results = results.filter(p =>
      p.placements?.includes(placement)
    );
  }

  return results.slice(0, limit);
}

module.exports = moreFromBrand;
