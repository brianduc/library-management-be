/* eslint-disable no-undef */
require("dotenv").config();

module.exports = {
  databaseURL: process.env.MONGODB_URI,
  databaseName: process.env.MONGODB_DB_NAME,
};
