import Recommendations from "./components/Recommendations";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>E-Commerce Store</h1>
      <Recommendations />
    </div>
  );
}
function handleProductClick(productId) {
  fetch("/api/track", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userId,
      productId,
      event: "click"
    })
  })
    .then(res => res.json())
    .then(data => console.log("Tracked:", data))
    .catch(err => console.error(err));
}


export default App;
