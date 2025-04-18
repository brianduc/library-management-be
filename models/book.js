const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String },
  description: { type: String },
  quantity_total: { type: Number, default: 0 },
  quantity_available: { type: Number, default: 0 },
  status: { type: String, enum: ['available', 'out_of_stock', 'damaged'], default: 'available' },
  is_hidden: { type: Boolean, default: false },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  qr_code: { type: String }
}, { timestamps: true });

bookSchema.index({ title: 'text', author: 'text', description: 'text' });

module.exports = mongoose.model("Book", bookSchema);