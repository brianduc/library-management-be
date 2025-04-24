const Review = require("../models/review");
const User = require("../models/user");
const Book = require("../models/book");
const BorrowRecord = require("../models/borrow-record");
const mongoose = require("mongoose");
const ResponseHandler = require("../utils/response-handlers");



async function getAllReviewsOfBook(res, bookId) {
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return ResponseHandler.error(res, { message: "Invalid book ID format" });
  }
  const reviews = await Review.find({ book_id: bookId});
  return reviews;
}
async function getAllReviewsOfBookbyuser(res, bookId, userId) {
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return ResponseHandler.error(res, { message: "Invalid book ID format" });
  }
  const isBorrowed = await BorrowRecord.findOne({ book_id: bookId, user_id: userId, is_review: true});
  const reviews = await Review.find({ book_id: bookId, user_id: userId});
  
  if (isBorrowed && (!reviews || reviews.length === 0)) {
    // If there's a borrow record marked as reviewed but no actual reviews exist
    // Return a default review object
    return [{
      book_id: bookId,
      user_id: userId,
      rating: 0,
      comment: "No review content available",
      is_default: true
    }];
  }
  
  return reviews;
}

async function getNotReviewedBooks(res, userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return ResponseHandler.error(res, { message: "Invalid user ID format" });
  }
  
  try {
    const borrowRecords = await BorrowRecord.find({
      user_id: userId,
      is_returned: true,
      is_review: false,
    })
    .sort({ borrow_date: -1 })  // Sort by borrow_date in descending order
    .populate("book_id");
    if(borrowRecords.length === 0){
      return ResponseHandler.error(res, { message: "Do not have any review" });
    }
    return borrowRecords;
  } catch (error) {
    
    console.error("Error in getNotReviewedBooks:", error);
    return ResponseHandler.error(res, { message: "Error fetching not reviewed books" });
  }
}

async function createReview(res,data, userId) {
  const { book_id, rating, comment } = data;
  if (!mongoose.Types.ObjectId.isValid(book_id)) {
    return ResponseHandler.error(res, { message: "User or book not found" });
  }
  const user = await User.findById(userId);
  const book = await Book.findById(book_id);
  if (!user || !book) {
    return ResponseHandler.error(res, { message: "User or book not found" });
  }
  const borrowRecord = await BorrowRecord.find({
    user_id: userId,
    book_id,
    is_returned: true,
    is_review: false,
  });
  
  if (borrowRecord.length === 0) {
    return ResponseHandler.error(res, { message: "Book not returned" });
  }

  const review = new Review({
    user_id: userId,
    book_id,
    rating,
    comment,
  });

  await review.save();
  
  // Update all matching borrow records
  const borrowRecord11 = await BorrowRecord.updateMany(
    {
      user_id: userId,
      book_id,
      is_returned: true,
      is_review: false,
    },
    { $set: { is_review: true } }
  );
  return review;
}

async function updateReview(res, reviewId, data) {
  const review = await Review.findById(reviewId);
  if (!review) {
    return ResponseHandler.error(res, { message: "Review not found" });
  }
  const updatedReview = await Review.findByIdAndUpdate(reviewId, data, { new: true });
  return updatedReview;
}

async function deleteReview(res, reviewId, userId) {
  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return ResponseHandler.error(res, { message: "Review not found" });
    }
    console.log("Review found:", review);

    try {
      await Review.findByIdAndDelete(reviewId);
    } catch (deleteError) {
      console.error("Error deleting review:", deleteError);
      return ResponseHandler.error(res, { message: "Error deleting review" });
    }
  } catch (error) {
    console.error("Error in deleteReview:", error);
    return ResponseHandler.error(res, { message: "Error in delete review process" });
  }
}

module.exports = {
  createReview,
  updateReview,
  deleteReview,
  getAllReviewsOfBook,
  getNotReviewedBooks,
  getAllReviewsOfBookbyuser
};
