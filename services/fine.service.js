const Fine = require("../models/fine");
const BorrowRecord = require("../models/borrow-record");
const Book = require("../models/book");
const ResponseHandler = require("../utils/response-handlers");
const { default: mongoose } = require("mongoose");

async function getAllFines(res) {
  const fines = await Fine.find()
    .populate('user_id', 'full_name email')
    .populate({
      path: 'borrow_record_id',
      model: 'BorrowRecord',
      populate: {
        path: 'book_id',
        model: 'Book',
        select: 'title author'
      },
    }).populate('book_id', 'title author');
    if(fines.length === 0){
      return ResponseHandler.error(res, { message: "Do not have any fine" });
    }
    return fines;
}

async function getFineByUser(res, userId) {
  const fines = await Fine.find({ user_id: userId })
    .populate('user_id', 'name email')
    .populate({
      path: 'borrow_record_id',
      model: 'BorrowRecord',
      populate: {
        path: 'book_id',
        model: 'Book',
        select: 'title author'
      }
    });
    if(fines.length === 0){
      return ResponseHandler.error(res, { message: "Do not have any fine" });
    }
    return fines; 
}

async function payFine(fineId) {
  const fine = await Fine.findById(fineId);
  if (!fine) {
    return null;
  }
  fine.is_paid = true;
  await fine.save();
  return fine;
}

async function createFine(res, fineData) {

  const userId = fineData.user_id;
  const bookId = fineData.book_id;
  const fineAmount =  fineData.amount;
  const fineReason = fineData.reason;
  const fine = new Fine({
    user_id: userId,
    book_id: bookId,
    amount: fineAmount,
    reason: fineReason,
  });
  await fine.save();
  return await fine.populate([
    { path: 'user_id', select: 'full_name email' },
    {
      path: 'book_id',
      model: 'Book',
      select: 'title author'
    }
  ]);
}


async function autoCreateFine(res, userId) {
  const check_borrow_record = await BorrowRecord.find({
    user_id: userId,
    is_returned: false,

  });
  const current_date = new Date();

  for (const borrowRecord of check_borrow_record) {
    const due_date = new Date(borrowRecord.due_date);
    if (current_date <= due_date) continue; // chưa quá hạn

    const diffTimeMs = current_date - due_date;
    // Tính số lần 10 giây đã trôi qua kể từ due_date
    const overTimes = Math.floor(diffTimeMs / (10 * 1000)); // mỗi 10 giây
    const fineAmount = overTimes * 1000;

    // Tính tổng số giây
    const totalSeconds = Math.floor(diffTimeMs / 1000);
    let fineReason = "";

    if (totalSeconds >= 3600) {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      fineReason = `Trễ ${hours} giờ ${minutes} phút ${seconds} giây`;
    } else if (totalSeconds >= 60) {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      fineReason = `Trễ ${minutes} phút ${seconds} giây`;
    } else {
      fineReason = `Trễ ${totalSeconds} giây`;
    }

    // Tìm fine hiện có cho bản ghi mượn này
    const existingFine = await Fine.findOne({
      borrow_record_id: borrowRecord._id,
      is_paid: false
    });

    if (existingFine) {
      // Nếu đã có fine, cập nhật amount và reason
      existingFine.amount = fineAmount;
      existingFine.reason = fineReason;
      await existingFine.save();
    } else {
      const paidFine = await Fine.findOne({
        borrow_record_id: borrowRecord._id,
        is_paid: true
      });

      // Chỉ tạo fine mới nếu chưa có fine nào (cả đã thanh toán và chưa thanh toán)
      if (!paidFine) {
        const fine = new Fine({
          user_id: userId,
          borrow_record_id: borrowRecord._id,
          amount: fineAmount,
          reason: fineReason,
          is_paid: false
        });
        await fine.save();
      }
    }
  }
}


module.exports = {
  getAllFines,
  getFineByUser,
  payFine,
  createFine,
  autoCreateFine,
};
