const { z } = require("zod");

const registerSchema = z.object({
  full_name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

module.exports = {
  registerSchema,
  loginSchema,
};
