const express = require("express");
const cors = require("cors");

const recommendationsRoute = require("./routes/recommendations");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/recommendations", recommendationsRoute);

module.exports = app;
