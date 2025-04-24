const userService = require("../../services/user.service");
const ResponseHandler = require("../../utils/response-handlers");
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
async function getAllUsersv2(req, res, next) {
  try {
    const users = await userService.getAllUsersv2();
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
    const validated = createUserSchema.parse(req.body);
    const newUser = await userService.createUser(validated);
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

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAllUsersv2,
};
