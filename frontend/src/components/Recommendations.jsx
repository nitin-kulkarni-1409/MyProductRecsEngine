import { useEffect, useRef, useState } from "react";

/**
 * -----------------------------
 * Defaults
 * -----------------------------
 */
const DEFAULTS = {
  userId: 33,
  category: "general",
  limit: 5,
  gender: "women",
  placement: "any",
  type: "",
};

/**
 * -----------------------------
 * Read URL params
 * -----------------------------
 */
function getParamsFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  
  return {
    userId: Number(urlParams.get("userId")) || DEFAULTS.userId,
    category: urlParams.get("category") || DEFAULTS.category,
    limit: Number(urlParams.get("limit")) || DEFAULTS.limit,
    gender: urlParams.get("gender") || DEFAULTS.gender,
    placement: urlParams.get("placement") || DEFAULTS.placement,
    type: urlParams.get("type") || DEFAULTS.type,
  };
}

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [strategy, setStrategy] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔒 Guard against React 18 double-effect
  const hasFetched = useRef(false);

  const params = getParamsFromURL();
  const { userId } = params;

  /**
   * -----------------------------
   * Fetch recommendations
   * -----------------------------
   */
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    
    function extractProducts(data) {
      // Case 1: already an array
      if (Array.isArray(data)) {
        return data;
      }

      // Case 2: object of products → convert to array
      if (
        data &&
        typeof data === "object" &&
        Object.values(data).every(
          (v) => typeof v === "object" && v !== null && "name" in v
        )
      ) {
        return Object.values(data);
      }

      // Case 3: recursively search nested objects
      if (data && typeof data === "object") {
        for (const key of Object.keys(data)) {
          const result = extractProducts(data[key]);
          if (result.length > 0) return result;
        }
      }

      return [];
    }


    const query = new URLSearchParams(params).toString();

    fetch(`/api/recommendations?${query}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch recommendations");
        return res.json();
      })
      .then((data) => {
        console.log("🧾 FULL API RESPONSE:", data);
        const recs = extractProducts(data);

        console.log("✅ NORMALIZED RECS:", recs);

        setRecommendations(recs);
        setStrategy(data.strategy || "unknown");
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  /**
   * -----------------------------
   * Track click
   * -----------------------------
   */
  const handleClick = async (productId) => {
    console.log("🖱 Tracking click:", { userId, productId });

    try {
      await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          productId,
          event: "click",
        }),
      });
    } catch (err) {
      console.error("Tracking failed", err);
    }
  };

  /**
   * -----------------------------
   * Render
   * -----------------------------
   */
  if (loading) return <h3>Loading recommendations...</h3>;
  if (error) return <h3>Error: {error}</h3>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Product Recommendations</h2>

      <p>
        <strong>User:</strong> {userId} <br />
        <strong>Strategy:</strong> {strategy}
      </p>

      {recommendations.length === 0 ? (
        <p>No recommendations available</p>
      ) : (
        <ul>
          {recommendations.map((product, index) => {
            const productId =
              product.id ??
              product.productId ??
              product.sku ??
              index;

            return (
              <li key={productId} style={{ marginBottom: "12px" }}>
                <strong>{product.name}</strong> – ${product.price}
                <br />
                <button onClick={() => handleClick(productId)}>
                  View Product
                </button>
              </li>
            );
          })}
        </ul>
      )}


    </div>
  );
}
