// src/api/routes/index.js

const express = require("express");
const userRoutes = require("./user.routes");
const authRoutes = require("./auth.routes");

const bookRoutes = require("./book.routes");
const categoryRoutes = require("./category.routes");

const borrowRequestRoutes = require("./borrowRequest.routes");
const borrowRecordRoutes = require("./borrowRecord.routes");



const fineRoutes = require("./fine.routes");
const router = express.Router();

// Health check specific to API
router.get("/status", (req, res) => {
  res.status(200).json({ status: "API is running" });
});

// Mount routes
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/books", bookRoutes);

router.use("/categories", categoryRoutes);

router.use("/borrow-requests", borrowRequestRoutes);
router.use("/borrow-records", borrowRecordRoutes);

router.use("/fines", fineRoutes);
module.exports = router;
