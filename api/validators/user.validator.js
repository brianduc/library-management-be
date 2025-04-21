const { z } = require("zod");

const baseUserSchema = {
  fullname: z.string().min(1, "Fullname is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(9, "Phone is required"),
  identityNumber: z.string().min(9, "Identity number is required"),
  role: z.enum(["admin", "staff", "member"]),
};

const createUserSchema = z.object({
  ...baseUserSchema,
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const updateUserSchema = z.object({
  fullname: baseUserSchema.fullname.optional(),
  email: baseUserSchema.email.optional(),
  phone: baseUserSchema.phone.optional(),
  identityNumber: baseUserSchema.identityNumber.optional(),
  role: baseUserSchema.role.optional(),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
};
