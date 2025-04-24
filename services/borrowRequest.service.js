const BorrowRecord = require("../models/borrow-record");
const BorrowRequest = require("../models/borrow-request");
const userService = require("../services/user.service");
const Book = require("../models/book");

const transporter = require("../../utils/mailer")
async function getAll() {
  return await BorrowRequest.find()
    .populate("user_id", "full_name email _id")
    .populate("book_id", "title author");
}

async function getByUserId(userId) {
  const userExist = await userService.getUserById(userId);
  if (!userExist) return null;

  return await BorrowRequest.find({ user_id: userId }).populate(
    "book_id",
    "title author"
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

  const isBorrowing = await BorrowRecord.findOne({
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
  const data = await BorrowRequest.findById(id)
    .populate("user_id", "full_name email")
    .populate("book_id", "title");

  if (!data) return null;

  if (data.status === "approved") {
    return {
      error: true,
      message: "Borrow request is already approved",
      statusCode: 400,
    };
  }

  if (status === "approved") {
    const book = await Book.findById(data.book_id);
    if (!book) {
      return {
        error: true,
        message: "Book not found",
        statusCode: 404,
      };
    }

    if (book.quantity_available <= 0) {
      return {
        error: true,
        message: "Book is currently not available for borrowing",
        statusCode: 400,
      };
    }

    book.quantity_available -= 1;
    if (book.quantity_available === 0) {
      book.status = "out_of_stock";
    }

    await book.save();
    updateData.approved_date = new Date();
  }

  if (status === "rejected") {
    updateData.rejected_date = new Date();

    // Gửi email từ chối
    await sendRejectionEmail(
      data.user_id.email,
      data.user_id.full_name,
      data.book_id.title
    );
  }

  return await BorrowRequest.findByIdAndUpdate(id, updateData, { new: true })
    .populate("user_id", "full_name email _id")
    .populate("book_id", "title author");
}

async function sendRejectionEmail(email, fullName, bookTitle) {
  console.log("sendRejectionEmail", email, fullName, bookTitle)


  const mailOptions = {
    from: '"Library System" <your.email@gmail.com>',
    to: email,
    subject: "Yêu cầu mượn sách đã bị từ chối",
    html: `<p>Chào ${fullName},</p>
           <p>Rất tiếc, yêu cầu mượn sách <strong>${bookTitle}</strong> của bạn đã bị từ chối.</p>
           <p>Vui lòng liên hệ với thư viện để biết thêm chi tiết.</p>
           <p>Trân trọng,<br/>Hệ thống thư viện</p>`,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("Rejection email sent successfully");
  } catch (error) {
    console.error("Error sending rejection email:", error);
  }
}

module.exports = {
  getAll,
  getByUserId,
  create,
  updateStatus,
};
