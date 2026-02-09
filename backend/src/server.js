const express = require("express");
const app = express();

app.use(express.json()); // 🔥 MUST be ABOVE routes

const recommendationsRoute = require("./routes/recommendations");
const trackRoute = require("./routes/track");

app.use("/api/recommendations", recommendationsRoute);
app.use("/api/track", trackRoute);

app.listen(3001, () => {
  console.log("Backend running on port 3001");
});
