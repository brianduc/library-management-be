const authService = require("../services/auth.service");
const { registerSchema, loginSchema } = require("../validators/auth.validator");
const ResponseHandler = require("../utils/responseHandler");

async function register(req, res, next) {
  try {
    const validated = registerSchema.parse(req.body);
    const user = await authService.register(validated);
    return ResponseHandler.success(res, {
      statusCode: 201,
      message: "User registered successfully",
      data: user,
    });
  } catch (err) {
    if (err.name === "ZodError") {
      const errors = err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return ResponseHandler.badRequest(res, "Validation failed", errors);
    }
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const result = await authService.login(email, password);
    if (!result) {
      return ResponseHandler.unauthorized(res, "Invalid email or password");
    }

    const { user, token } = result;
    return ResponseHandler.success(res, {
      message: "Login successful",
      data: { user, token },
    });
  } catch (err) {
    if (err.name === "ZodError") {
      const errors = err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return ResponseHandler.badRequest(res, "Validation failed", errors);
    }
    next(err);
  }
}

async function getCurrentUser(req, res) {
  return ResponseHandler.success(res, {
    message: "Current user fetched",
    data: req.user,
  });
}

module.exports = {
  register,
  login,
  getCurrentUser,
};
