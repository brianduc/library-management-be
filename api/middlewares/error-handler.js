/* eslint-disable no-undef */
const ResponseHandler = require("../../utils/response-handlers");
/**
 * Error handling middleware for Express.js applications.
 * This middleware captures errors thrown in the application and sends a standardized error response.
 *
 * @param {Error} err - The error object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  // Log the error
  console.error(`Error ${status}: ${message}`);
  if (status === 500) {
    console.error(err.stack);
  }

  const errors = err.errors || [];

  return ResponseHandler.error(res, {
    statusCode: status,
    message,
    errors:
      process.env.NODE_ENV === "development"
        ? [...errors, { stack: err.stack }]
        : errors,
  });
}

module.exports = errorHandler;
