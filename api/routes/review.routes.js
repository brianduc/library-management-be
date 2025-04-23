const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controler");
const { authenticate } = require("../middlewares/auth");

router.post("/", authenticate, reviewController.createReview);
router.put("/:reviewId", authenticate, reviewController.updateReview);
router.delete("/:reviewId", authenticate, reviewController.deleteReview);
router.get("/not-reviewed", authenticate, reviewController.getNotReviewedBooks);
router.get("/book/:bookId", reviewController.getAllReviewsOfBook);

module.exports = router;
