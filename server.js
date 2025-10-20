// server.js
const express = require("express");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");

const productRoutes = require("./routes/productRoutes");
const { errorHandler } = require("./middleware/errorHandler");
const logger = require("./middleware/logger");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(logger);

// Root route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// API routes
app.use("/api/products", productRoutes);

// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});

module.exports = app;
