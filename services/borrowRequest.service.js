const BorrowRecord = require("../models/borrow-record");
const BorrowRequest = require("../models/borrow-request");
const userService = require("../services/user.service");
const Book = require("../models/book");

const transporter = require("../utils/mailer");
async function getAll() {
  return await BorrowRequest.find()
    .populate("user_id", "full_name email _id")
    .populate("book_id", "title author");
}

async function getByUserId(userId) {
  const userExist = await userService.getUserById(userId);

  if (!userExist) return null;

  return await BorrowRequest.find({ user_id: userId })
    .populate("user_id", "full_name email _id")
    .populate("book_id", "title author");
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
  const data = await BorrowRequest.findById(id)
    .populate("user_id", "full_name email")
    .populate("book_id", "title author");

  if (!data) return null;

  if (data.status === "approved") {
    return {
      error: true,
      message: "Borrow request is already approved",
      statusCode: 400,
    };
  }

  // Kiểm tra và cập nhật trạng thái sách (chỉ duy nhất một hàm)
  if (status === "approved" || status === "rejected") {
    const book = await Book.findById(data.book_id);
    if (!book) {
      return {
        error: true,
        message: "Book not found",
        statusCode: 404,
      };
    }

    // Chỉ khi duyệt (approved) mới thay đổi số lượng sách
    if (status === "approved") {
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

      // Cập nhật ngày duyệt
      data.approved_date = new Date();
    } else {
      // Cập nhật ngày từ chối
      data.rejected_date = new Date();
    }

    // Gửi email tương ứng
    await sendEmail(
      data.user_id.email,
      data.user_id.full_name,
      data.book_id.title,
      status,
    );
  }

  // Cập nhật trạng thái của yêu cầu mượn
  data.status = status;
  await data.save();

  return data;
}

// Hàm gửi email chung cho cả phê duyệt và từ chối
async function sendEmail(email, fullName, bookTitle, status) {
  const subject =
    status === "approved"
      ? "Yêu cầu mượn sách đã được duyệt"
      : "Yêu cầu mượn sách đã bị từ chối";

  const html =
    status === "approved"
      ? `<p>Chào ${fullName},</p>
         <p>Chúng tôi vui mừng thông báo rằng yêu cầu mượn sách <strong>${bookTitle}</strong> của bạn đã được duyệt.</p>
         <p>Vui lòng đến thư viện để nhận sách trong thời gian quy định.</p>
         <p>Trân trọng,<br/>Hệ thống thư viện</p>`
      : `<p>Chào ${fullName},</p>
         <p>Rất tiếc, yêu cầu mượn sách <strong>${bookTitle}</strong> của bạn đã bị từ chối.</p>
         <p>Vui lòng liên hệ với thư viện để biết thêm chi tiết.</p>
         <p>Trân trọng,<br/>Hệ thống thư viện</p>`;

  const mailOptions = {
    from: '"Library System" <your.email@gmail.com>',
    to: email,
    subject: subject,
    html: html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`${status} email sent successfully`);
  } catch (error) {
    console.error(`Error sending ${status} email:`, error);
  }
}

module.exports = {
  getAll,
  getByUserId,
  create,
  updateStatus,
};
