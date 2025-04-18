// src/loaders/mongoose.js

const mongoose = require("mongoose");
const config = require("../config/database");

async function initMongoose() {
  const connection = await mongoose.connect(config.databaseURL, {
    dbName: config.databaseName,
  });

  // Add connection monitoring
  mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected. Attempting to reconnect...");
  });

  mongoose.connection.on("reconnected", () => {
    console.info("MongoDB reconnected successfully");
  });

  return connection;
}

module.exports = initMongoose;
