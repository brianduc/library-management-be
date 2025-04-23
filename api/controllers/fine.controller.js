const fineService = require("../../services/fine.service");
const ResponseHandler = require("../../utils/response-handlers");

async function getAllFines(req, res, next) {
  try {
    const fines = await fineService.getAllFines();
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
    const fines = await fineService.getFineByUser(userId);
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
    const fine = await fineService.payFine(fineId);
    fine.is_paid = true;
    await fine.save();
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
    const { borrow_record_id, amount, reason } = req.body;

    if (!borrow_record_id || !amount) {
      return ResponseHandler.badRequest(res, {
        message: "borrow_record_id and amount are required",
      });
    }

    const fine = await fineService.createFine({
      borrow_record_id,
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
