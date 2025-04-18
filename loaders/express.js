const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const routes = require("../api/routes");
const errorHandler = require("../api/middlewares/error-handler");

async function initExpress({ app }) {
  // Health check endpoint
  app.get("/health", (req, res) => {
    res.status(200).send("OK");
  });

  // Middleware
  app.use(cors());
  app.use(helmet());
  app.use(compression());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API routes
  app.use("/api", routes);

  // 404 handler
  app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    error.status = 404;
    next(error);
  });

  // Error handling middleware
  app.use(errorHandler);

  return app;
}

module.exports = initExpress;
