const userService = require("../../services/user.service");
const ResponseHandler = require("../../utils/response-handlers");
const { generatePassword } = require("../../utils/utils");
const transporter = require("../../utils/mailer");
const {
  createUserSchema,
  updateUserSchema,
} = require("../validators/user.validator");

async function getAllUsers(req, res, next) {
  try {
    const users = await userService.getAllUsers();
    return ResponseHandler.success(res, {
      message: "List of users fetched successfully",
      data: users,
    });
  } catch (err) {
    next(err);
  }
}

async function getUserById(req, res, next) {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return ResponseHandler.notFound(res, "User not found");
    return ResponseHandler.success(res, {
      message: "User fetched successfully",
      data: user,
    });
  } catch (err) {
    next(err);
  }
}

async function createUser(req, res, next) {
  try {
    const password = generatePassword();
    const validated = createUserSchema.parse({ ...req.body, password });
    const newUser = await userService.createUser(validated);

    await transporter.sendMail({
      // eslint-disable-next-line no-undef
      from: `"LMS Admin" <${process.env.EMAIL_USER}>`,
      to: validated.email,
      subject: "Your LMS Account Has Been Created",
      html: `
        <h2>Welcome, ${validated.full_name}!</h2>
        <p>Your account has been created by the administrator.</p>
        <p><b>Email:</b> ${validated.email}</p>
        <p><b>Password:</b> ${password}</p>
        <p>Please log in and change your password after first login.</p>
      `,
    });
    return ResponseHandler.success(res, {
      statusCode: 201,
      message: "User created successfully",
      data: newUser,
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

async function updateUser(req, res, next) {
  try {
    const validated = updateUserSchema.parse(req.body);
    const updatedUser = await userService.updateUser(req.params.id, validated);
    if (!updatedUser) return ResponseHandler.notFound(res, "User not found");
    return ResponseHandler.success(res, {
      message: "User updated successfully",
      data: updatedUser,
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

async function deleteUser(req, res, next) {
  try {
    const deleted = await userService.deleteUser(req.params.id);
    if (!deleted) return ResponseHandler.notFound(res, "User not found");
    return ResponseHandler.success(res, {
      message: "User deleted successfully",
    });
  } catch (err) {
    next(err);
  }
}

async function lockUser(req, res, next) {
  try {
    const lockedUser = await userService.lockUser(req.params.id);
    if (!lockedUser) return ResponseHandler.notFound(res, "User not found");
    return ResponseHandler.success(res, {
      message: "User locked successfully",
      data: lockedUser,
    });
  } catch (err) {
    next(err);
  }
}

async function unlockUser(req, res, next) {
  try {
    const unlockedUser = await userService.unlockUser(req.params.id);
    if (!unlockedUser) return ResponseHandler.notFound(res, "User not found");
    return ResponseHandler.success(res, {
      message: "User unlocked successfully",
      data: unlockedUser,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  lockUser,
  unlockUser,
};
