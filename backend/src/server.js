const express = require("express");
const app = express();

const recommendationsRoute = require("./routes/recommendations");

app.use("/api/recommendations", recommendationsRoute);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
