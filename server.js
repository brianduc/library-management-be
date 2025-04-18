/* eslint-disable no-undef */
const startServer = require("./app");

// Start the application
startServer()
  .then(() => {
    console.info("Application started successfully");
  })
  .catch((error) => {
    console.error("Failed to start application:", error);
    process.exit(1);
  });
