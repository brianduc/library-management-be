const BorrowRecord = require("../models/borrow-record");
const book = require("../models/book");
const userService = require("../services/user.service");
async function getAll() {
  const borrowRecords = await BorrowRecord.find()
    .populate("user_id", "full_name email _id identity_number")
    .populate("book_id", "title author");
  return borrowRecords;
}

async function getByUserId(userId) {
  const userExist = await userService.getUserById(userId);
  if (!userExist) {
    return null; 
  }

  return await BorrowRecord.find({ user_id: userId })
    .populate("book_id", "title author")
    .populate("user_id", "full_name email identity_number");
}

async function create(data) {
  const userExist = await userService.getUserById(data.user_id);
  if (!userExist) {
    return { error: true, message: "User not found", statusCode: 404 };
  }

  const bookExist = await book.findById(data.book_id);
  if (!bookExist) {
    return { error: true, message: "Book not found", statusCode: 404 };
  }

  const existingRecord = await BorrowRecord.findOne({
    user_id: data.user_id,
    book_id: data.book_id,
    is_returned: false,
  });

  if (existingRecord) {
    return {
      error: true,
      message: "This book is already borrowed and has not been returned yet.",
      statusCode: 400,
    };
  }

  const borrowRecord = new BorrowRecord({
    user_id: data.user_id,
    book_id: data.book_id,
    // due_date: data.due_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    due_date: new Date(Date.now() + 1 * 60 * 1000),
  });

  await borrowRecord.save();
  return { error: false, data: borrowRecord };
}


async function returnBook(id) {
  const borrowRecord = await BorrowRecord.findById(id);

  if (!borrowRecord) {
    return { error: true, message: "Borrow record not found", statusCode: 404 };
  }

  if (borrowRecord.is_returned) {
    return {
      error: true,
      message: "This book has already been returned",
      statusCode: 400,
    };
  }

  borrowRecord.is_returned = true;
  borrowRecord.return_date = new Date();

  await borrowRecord.save();
  const bookDetail = await book.findById(borrowRecord.book_id);
  console.log(bookDetail)
  if (bookDetail) {
    bookDetail.quantity_available += 1;

    // Nếu sách bị gán trạng thái "out_of_stock" trước đó và giờ đã có hàng, cập nhật lại
    if (bookDetail.status === "out_of_stock" && bookDetail.quantity_available > 0) {
      bookDetail.status = "available";
    }

    await bookDetail.save();
  }
  return { error: false, data: borrowRecord };
}

module.exports = {
  getAll,
  getByUserId,
  create,
  returnBook,
};
