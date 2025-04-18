/**
 * @typedef {import('mongoose').Model} Model
 * @typedef {Record<string, Model>} Models
 */

module.exports = /** @type {Models} */ ({
  User: require("./user"),
  Book: require("./book"),
  Category: require("./category"),
  BorrowRequest: require("./borrow-request"),
  BorrowRecord: require("./borrow-record"),
  Fine: require("./fine"),
  Review: require("./review"),
  Notification: require("./notification"),
});
