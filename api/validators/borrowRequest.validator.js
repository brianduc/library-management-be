
const { z } = require("zod");
// Reusable MongoDB ObjectId pattern
const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");


const baseBorrowRequestSchema = {
  user_id: objectId,
  book_id: objectId,
  request_date: z.date().optional(),
  approved_date: z.date().optional(),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
};


const createBorrowRequestSchema = z.object({
  user_id: baseBorrowRequestSchema.user_id,
  book_id: baseBorrowRequestSchema.book_id,
  request_date: baseBorrowRequestSchema.request_date,
  approved_date: baseBorrowRequestSchema.approved_date,
});



module.exports = {
  createBorrowRequestSchema,
};
