const Fine = require("../models/fine");
const BorrowRecord = require("../models/borrow-record");
const Book = require("../models/book");

async function getAllFines() {
  return await Fine.find()
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
}

async function getFineByUser(userId) {
  return await Fine.find({ user_id: userId })
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
}

async function payFine(fineId) {
  const fine = await Fine.findById(fineId);
  if (!fine) {
    throw new Error("Fine not found");
  }
  if (fine.is_paid) {
    throw new Error("Fine already paid");
  }
  fine.is_paid = true;
  await fine.save();
  return fine;
}


module.exports = {
  getAllFines,
  getFineByUser,
  payFine,
};
