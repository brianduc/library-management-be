const { z } = require("zod");


const baseBookSchema = {
  title: z.string().min(1, "Title is required"), 
  author: z.string().min(1, "Author is required"), 
  image_url:z.string().optional(),
  description: z.string().min(1, "Description is required"), 
  quantity_total: z.number().min(1, "Total quantity must be greater than 0"), 
  quantity_available: z.number().min(0, "Available quantity cannot be less than 0"),
  status: z.enum(["damaged", "out_of_stock", "available"]),
  is_hidden: z.boolean(), 
  qr_code: z.string().min(1, "QR code is required"), 
  category_id: z.string().min(1, "Category ID is required"), 
};

const createBookSchema = z.object({
  ...baseBookSchema,
  
});

const updateBookSchema = z.object({
  title: baseBookSchema.title.optional(),
  author: baseBookSchema.author.optional(),
  description: baseBookSchema.description.optional(),
  image_url:z.string().optional(),
  quantity_total: baseBookSchema.quantity_total.optional(),
  quantity_available: baseBookSchema.quantity_available.optional(),
  status: baseBookSchema.status.optional(),
  is_hidden: baseBookSchema.is_hidden.optional(),
  qr_code: baseBookSchema.qr_code.optional(),
  category_id: baseBookSchema.category_id.optional(),
});

module.exports = {
  createBookSchema,
  updateBookSchema,
};
