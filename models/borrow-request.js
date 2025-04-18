const mongoose = require("mongoose");

const borrowRequestSchema = new mongoose.Schema({
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
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  request_date: { type: Date, default: Date.now },
  approved_date: { type: Date },
});

module.exports = mongoose.model("BorrowRequest", borrowRequestSchema);
