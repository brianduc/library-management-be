const mongoose = require("mongoose");

const fineSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  borrow_record_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BorrowRecord",
    required: true,
  },
  amount: { type: Number, required: true },
  reason: { type: String },
  is_paid: { type: Boolean, default: false },
  issued_date: { type: Date, default: Date.now },
});

fineSchema.index({ user_id: 1, is_paid: 1 });

module.exports = mongoose.model("Fine", fineSchema);
