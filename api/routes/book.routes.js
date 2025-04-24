const express = require("express");
const router = express.Router();
const bookController = require("../controllers/book.controller");
const { authenticate, authorizeRole } = require("../middlewares/auth");

// Book routes
router.get(
  "/",
  authenticate,
  authorizeRole("admin", "staff", "member"),
  bookController.getAllBooks,
);
router.get(
  "/v2",
  authenticate,
  authorizeRole("admin", "staff", "member"),
  bookController.getAllBooksv2,
);
router.get(
  "/:id",
  authenticate,
  authorizeRole("admin", "staff", "member"),
  bookController.getBookById,
);
router.post(
  "/",
  authenticate,
  authorizeRole("admin", "staff"),
  bookController.createBook,
);
router.put(
  "/:id",
  authenticate,
  authorizeRole("admin", "staff"),
  bookController.updateBook,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRole("admin","staff"),
  bookController.deleteBook,
);
router.patch(
  "/:id/hide",
  authenticate,
  authorizeRole("admin","staff"),
  bookController.changeStatusBook,
);
module.exports = router;
