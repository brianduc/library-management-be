const mongoose = require("mongoose");

const borrowRecordSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  book_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  borrow_date: { type: Date, default: Date.now },
  due_date: { type: Date, required: true },
  return_date: { type: Date },
  is_returned: { type: Boolean, default: false },
});

borrowRecordSchema.index({ user_id: 1, is_returned: 1 });

module.exports = mongoose.model("BorrowRecord", borrowRecordSchema);
