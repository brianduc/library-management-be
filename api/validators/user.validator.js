const { z } = require("zod");

const baseUserSchema = {
  full_name: z.string().min(1, "Fullname is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(9, "Phone is required"),
  identity_number: z.string().min(1, "Identity number is required"),
  role: z.enum(["admin", "staff", "member"]),
  is_active: z.boolean(),
};

const createUserSchema = z.object({
  ...baseUserSchema,
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const updateUserSchema = z.object({
  ...baseUserSchema,
});

module.exports = {
  createUserSchema,
  updateUserSchema,
};
