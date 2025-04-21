const { z } = require("zod");

const registerSchema = z.object({
  fullname: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
  identityNumber: z.string().min(9).max(12),
  password: z.string().min(6),
  role: z.enum(["admin", "staff", "member"]),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

module.exports = {
  registerSchema,
  loginSchema,
};
