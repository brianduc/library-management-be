const expressLoader = require("./express");
const mongooseLoader = require("./mongoose");

async function init({ expressApp }) {
  // Initialize database connection
  await mongooseLoader();
  console.log("Database connected");
  // Initialize express framework
  await expressLoader({ app: expressApp });
  console.log("Express initialized");
}

module.exports = { init };
