/* eslint-disable no-undef */

const express = require("express");
const config = require("./config/server");
const loaders = require("./loaders");

async function startServer() {
  const app = express();

  // Initialize application loaders
  await loaders.init({ expressApp: app });

  // Start the server
  app.listen(config.port, () => {
    console.info(`Server running on port ${config.port}`);
  });

  // Handle unexpected errors
  process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    process.exit(1);
  });

  process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    process.exit(1);
  });

  return app;
}

// Only start server if this file is run directly (not required/imported)
if (require.main === module) {
  startServer();
}

module.exports = startServer;
