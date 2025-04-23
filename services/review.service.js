const Review = require("../models/review");
const User = require("../models/user");
const Book = require("../models/book");
const BorrowRecord = require("../models/borrow-record");

async function getAllReviewsOfBook(bookId) {
  const reviews = await Review.find({ book_id: bookId });
  return reviews;
}
async function getNotReviewedBooks(userId) {
  const borrowRecords = await BorrowRecord.find({
    user_id: userId,
    is_returned: true,
    is_review: false,
  }).populate("book_id");
  
  return borrowRecords;
}

async function createReview(data, userId) {
  const { book_id, rating, comment } = data;
  const user = await User.findById(userId);
  const book = await Book.findById(book_id);
  const borrowRecord = await BorrowRecord.findOne({
    user_id: userId,
    book_id,
    is_returned: true,
    is_review: false,
  });
  
  if (!borrowRecord) {
    throw new Error("Book not returned");
  }


  if (!user || !book) {
    throw new Error("User or book not found");
  }

  const review = new Review({
    user_id: userId,
    book_id,
    rating,
    comment,
  });

  await review.save();
  borrowRecord.is_review = true;
  await borrowRecord.save();
  return review;
  
}

async function updateReview(reviewId, data) {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new Error("Review not found");
  }
  const updatedReview = await Review.findByIdAndUpdate(reviewId, data, { new: true });
  return updatedReview;
}

async function deleteReview(reviewId, userId) {
  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      throw new Error("Review not found");
    }
    console.log("Review found:", review);
    
    // const borrowRecord11 = await BorrowRecord.findOneAndUpdate(
    //   {
    //     user_id: review.user_id,
    //     book_id: review.book_id,
    //     is_returned: true,
    //     is_review: true,
    //   },
    //   { $set: { is_review: false } },
    //   { new: true }
    // );
    
    // if (!borrowRecord11) {
    //   throw new Error("Book not returned");
    // }

    try {
      await Review.findByIdAndDelete(reviewId);
    } catch (deleteError) {
      console.error("Error deleting review:", deleteError);
      throw deleteError;
    }
    
    // return borrowRecord11;
  } catch (error) {
    console.error("Error in deleteReview:", error);
    throw error;
  }
}

module.exports = {
  createReview,
  updateReview,
  deleteReview,
  getAllReviewsOfBook,
  getNotReviewedBooks
};
