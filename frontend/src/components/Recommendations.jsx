import { useEffect, useState } from "react";

export default function Recommendations() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const params = new URLSearchParams({
    userId: 33,
    channel: "nike",
    limit: 5,
    gender: "women",
    placement: "homepage"
  });

  fetch(`/api/recommendations?${params}`)
    .then(res => res.json())
    .then(data => {
      console.log("API data:", data); // <-- add this
      setItems(data.data || []);
      setLoading(false);
    })
    .catch(err => {
      console.error("API error:", err);
      setLoading(false);
    });
}, []);

  if (loading) return <p>Loading recommendations...</p>;

  return (
    <div>
      <h2>Recommended for You</h2>
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
