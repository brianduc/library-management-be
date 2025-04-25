const ResponseHandler = require("../../utils/response-handlers");
const reviewService = require("../../services/review.service");
async function getAllReviewsOfBook(req, res, next) {
  try {
    const reviews = await reviewService.getAllReviewsOfBook(res, req.params.bookId);
    return ResponseHandler.success(res, {
      message: "Reviews fetched successfully",
      data: reviews,
    });
  } catch (err) {
    next(err);
  }
}
async function getAllReviewsOfBookbyuser(req, res, next) {
  try {
    const reviews = await reviewService.getAllReviewsOfBookbyuser(res, req.params.bookId, req.user.id);
    return ResponseHandler.success(res, {
      message: "Reviews fetched successfully",
      data: reviews,
    });
  } catch (err) {
    next(err);
  }
}
async function createReview(req, res, next) {
  try {
    const review = await reviewService.createReview(res, req.body, req.user.id);
    return ResponseHandler.success(res, {
      message: "Review created successfully",
      data: review,
    });
  } catch (err) {
    next(err);
  }
}

async function updateReview(req, res, next) {
  try {
    const reviewId = req.params.reviewId;
    console.log(req.body);

    const review = await reviewService.updateReview(res, reviewId, req.body);
    if (!review) {
      return ResponseHandler.error(res, {
        message: "Review not found",
        statusCode: 404
      });
    }
    return ResponseHandler.success(res, {
      message: "Review updated successfully",
      data: review,
    });
  } catch (err) {
    if (err.message === "Review not found") {
      return ResponseHandler.error(res, {
        message: err.message,
        statusCode: 404
      });
    }
    next(err);
  }
}

async function deleteReview(req, res, next) {
  try {
    const reviewId = req.params.reviewId;
    await reviewService.deleteReview(res, reviewId, req.user.id);
    return ResponseHandler.success(res, {
      message: "Review deleted successfully",
    });
  } catch (err) {
    next(err);
  }
}

async function getNotReviewedBooks(req, res, next) {
  try {
    const books = await reviewService.getNotReviewedBooks(res, req.user.id);
    return ResponseHandler.success(res, {
      message: "Not-reviewed books fetched successfully",
      data: books,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllReviewsOfBook,
  createReview,
  updateReview,
  deleteReview,
  getNotReviewedBooks,
  getAllReviewsOfBookbyuser,
};
