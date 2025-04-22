
const { z } = require("zod");
// Reusable MongoDB ObjectId pattern
const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");


const baseBorrowRecordSchema = {
  user_id: objectId,
  book_id: objectId,
  borrow_date: z.date().optional(),
  due_date: z.preprocess(
    (arg) => (typeof arg === "string" || arg instanceof Date ? new Date(arg) : undefined),
    z.date()
  ),  
  return_date: z.date().optional(),
  is_returned: z.boolean().optional(),
};


const createBorrowRecordSchema = z.object({
  user_id: baseBorrowRecordSchema.user_id,
  book_id: baseBorrowRecordSchema.book_id,
  due_date: baseBorrowRecordSchema.due_date,
});


module.exports = {
  createBorrowRecordSchema,
};
