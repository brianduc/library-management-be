const borrowRecord = require("../models/borrow-record");
const BorrowRequest = require("../models/borrow-request");
const userService = require("../services/user.service");
const Book = require("../models/book");
async function getAll() {
  return await BorrowRequest.find()
    .populate("user_id", "full_name email _id")
    .populate("book_id", "title author");
}

async function getByUserId(userId) {
  const userExist = await userService.getUserById(userId);
  if (!userExist) {
    return null;
  }
  return await BorrowRequest.find({ user_id: userId }).populate(
    "book_id",
    "title author",
  );
}

async function create(data) {
  const userExist = await userService.getUserById(data.user_id);
  if (!userExist) {
    return {
      error: true,
      message: "User not found",
      statusCode: 404,
    };
  }

  const bookExist = await Book.findById(data.book_id);
  if (!bookExist) {
    return {
      error: true,
      message: "Book not found",
      statusCode: 404,
    };
  }

  const isBorrowing = await borrowRecord.findOne({
    user_id: data.user_id,
    book_id: data.book_id,
    is_returned: false,
  });

  if (isBorrowing) {
    return {
      error: true,
      message: "This book is currently borrowed and not returned yet.",
      statusCode: 400,
    };
  }

  const pendingRequest = await BorrowRequest.findOne({
    user_id: data.user_id,
    book_id: data.book_id,
    status: "pending",
  });

  if (pendingRequest) {
    return {
      error: true,
      message: "Borrow request is already pending. Please wait...",
      statusCode: 400,
    };
  }

  return (await BorrowRequest.create(data)).toObject();
}


async function updateStatus(id, status) {
  const updateData = { status };
  const data = await BorrowRequest.findById(id);
  if (!data) return null;
  if(data.status ==="approved")   return {
    error: true,
    message: "Borrow request is already approved",
    statusCode: 400,
  }; 

  console.log("update data", status)
 
  if (status === "approved") {
    // Lấy thông tin sách
    const book = await Book.findById(data.book_id);

    if (!book) {
      return {
        error: true,
        message: "Book not found",
        statusCode: 404,
      };
    }
    if (book.quantity_available <= 0) {
      console.log()
      return {
        error: true,
        message: "Book is currently not available for borrowing",
        statusCode: 400,
      };
    }

    // Trừ số lượng sách khả dụng
    book.quantity_available -= 1;

    // Nếu sau khi trừ còn 0, cập nhật status của sách thành "out_of_stock"
    if (book.quantity_available === 0) {
      book.status = "out_of_stock";
    }

    await book.save();
    updateData.approved_date = new Date();
  }
  return await BorrowRequest.findByIdAndUpdate(id, updateData, { new: true })
    .populate("user_id", "full_name email _id")
    .populate("book_id", "title author");
}

module.exports = {
  getAll,
  getByUserId,
  create,
  updateStatus,
};
