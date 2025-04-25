const authService = require("../../services/auth.service");
const { registerSchema, loginSchema } = require("../validators/auth.validator");
const ResponseHandler = require("../../utils/response-handlers");
const sendEmailInThread = require("../../utils/emailThread");

async function register(req, res, next) {
  try {
    const validated = registerSchema.parse(req.body);
    const user = await authService.register(validated);

    sendEmailInThread({
      to: user.email,
      subject: "[LM] Đăng ký tài khoản thành công",
      html: `
      <h2>Xin chào, ${validated.full_name}!</h2>
      <p>Tài khoản của bạn đã được tạo thành công. Vui lòng đăng nhập để sử dụng các tính năng của hệ thống.</p>
      <p>Chúc bạn một ngày tốt lành!</p>
    `,
    });

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

    const { user, accessToken } = result;
    return ResponseHandler.success(res, {
      message: "Login successful",
      data: { user, accessToken },
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

async function changePasswordFirstTime(req, res, next) {
  try {
    const { userId, newPassword } = req.body;
    const user = await authService.changePasswordFirstTime(userId, newPassword);
    return user;
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  getCurrentUser,
  changePasswordFirstTime,
};
