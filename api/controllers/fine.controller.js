const fineService = require("../../services/fine.service");
const ResponseHandler = require("../../utils/response-handlers");
const mongoose = require("mongoose");

async function getAllFines(req, res, next) {
  try {
    const fines = await fineService.getAllFines(res);
    return ResponseHandler.success(res, {
      message: "List of fines fetched successfully",
      data: fines,
    });
  } catch (err) {
    next(err);
  }
}

async function getFineByUser(req, res, next) {
  try {
    const userId = req.user._id; // Get user ID from authenticated user
    const fines = await fineService.getFineByUser(res, userId);
    if (fines.length === 0) {
      return ResponseHandler.notFound(res, {
        message: "No fines found",
        data: [],
      });
    }
    return ResponseHandler.success(res, {
      message: "User fines fetched successfully",
      data: fines,
    });
  } catch (err) {
    next(err);
  }
}

async function payFine(req, res, next) {
  try {
    const fineId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(fineId)) {
      return ResponseHandler.error(res, { message: "Invalid fine ID format" });
    }
    const fine = await fineService.payFine(fineId);
    if (!fine) {
      return ResponseHandler.error(res, { message: "Fine not found" });
    }
    return ResponseHandler.success(res, {
      message: "Fine paid successfully",
      data: fine,
    });
  } catch (err) {
    next(err);
  }
}

async function createFine(req, res, next) {
  try {
    const { user_id, amount, reason, book_id } = req.body;

    if (!user_id || !amount) {
      return ResponseHandler.badRequest(res, {
        message: "user_id and amount are required",
      });
    }

    const fine = await fineService.createFine(res, {
      user_id,
      book_id,
      amount,
      reason,
    });

    return ResponseHandler.success(res, {
      message: "Fine created successfully",
      data: fine,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllFines,
  getFineByUser,
  payFine,
  createFine,
};
