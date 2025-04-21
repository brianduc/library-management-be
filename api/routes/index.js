// src/api/routes/index.js

const express = require("express");
const userRoutes = require("./user.routes");
const authRoutes = require("./auth.routes");
const bookRoutes = require("./book.routes");
const router = express.Router();

// Health check specific to API
router.get("/status", (req, res) => {
  res.status(200).json({ status: "API is running" });
});

// Mount routes
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/books", bookRoutes);

module.exports = router;
